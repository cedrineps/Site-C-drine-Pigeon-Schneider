import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  FileText,
  ImagePlus,
  KeyRound,
  Lock,
  LogOut,
  Plus,
  Rocket,
  Sparkles,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import {
  MediaAsset,
  PortfolioData,
  ProjectCategory,
  ProjectItem,
  StudioState,
} from '../types/portfolio';

interface StudioModalProps {
  open: boolean;
  onClose: () => void;
  onPublishedUpdate: (published: PortfolioData) => void;
}

const TOKEN_KEY = 'pigeon_studio_token';

async function compressImageFile(file: File, maxDimension = 1500): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        resolve(canvas.toDataURL(mime, 0.86));
      };
      img.onerror = () => reject(new Error('Impossible de lire cette image.'));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error('Erreur de lecture du fichier.'));
    reader.readAsDataURL(file);
  });
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Erreur de lecture du fichier.'));
    reader.readAsDataURL(file);
  });
}

export function StudioModal({ open, onClose, onPublishedUpdate }: StudioModalProps) {
  const [statusLoading, setStatusLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [studioState, setStudioState] = useState<StudioState | null>(null);
  const [activeTab, setActiveTab] = useState<'portraits' | 'projects' | 'cv'>('portraits');
  const [busyMessage, setBusyMessage] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // Form states
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectCat, setNewProjectCat] = useState<ProjectCategory>('Créations visuelles');
  const [newProjectRole, setNewProjectRole] = useState('');
  const [newProjectChallenge, setNewProjectChallenge] = useState('');
  const [newProjectIdea, setNewProjectIdea] = useState('');

  const [newPasscode, setNewPasscode] = useState('');

  const getHeaders = () => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  };

  const loadStudioState = async () => {
    const res = await fetch('/api/studio/state', { headers: getHeaders() });
    if (res.status === 401) {
      setAuthenticated(false);
      return;
    }
    if (res.ok) {
      const data = (await res.json()) as StudioState;
      setStudioState(data);
      if (!selectedProjectId && data.draft.projects.length > 0) {
        setSelectedProjectId(data.draft.projects[0].id);
      }
    }
  };

  useEffect(() => {
    if (!open) return;
    setFeedback(null);
    setAuthError('');
    (async () => {
      setStatusLoading(true);
      try {
        const res = await fetch('/api/studio/status', { headers: getHeaders() });
        const contentType = res.headers.get('content-type') || '';
        if (!res.ok || !contentType.includes('application/json')) {
          setAuthError(
            "L’espace d’édition en direct fonctionne uniquement avec le serveur Node.js (non disponible sur un hébergement statique GitHub Pages / Netlify)."
          );
          return;
        }
        const data = await res.json();
        setIsInitialized(data.isInitialized);
        setAuthenticated(data.authenticated);
        if (data.authenticated) {
          await loadStudioState();
        }
      } catch {
        setAuthError('Connexion au serveur impossible.');
      } finally {
        setStatusLoading(false);
      }
    })();
  }, [open]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/studio/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: passcodeInput }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Code refusé.');
        return;
      }
      if (data.token) {
        sessionStorage.setItem(TOKEN_KEY, data.token);
      }
      setAuthenticated(true);
      setIsInitialized(true);
      setPasscodeInput('');
      await loadStudioState();
    } catch {
      setAuthError('Erreur réseau.');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/studio/logout', { method: 'POST', headers: getHeaders() });
    sessionStorage.removeItem(TOKEN_KEY);
    setAuthenticated(false);
    setStudioState(null);
  };

  const saveDraft = async (nextDraft: PortfolioData, msg?: string) => {
    setBusyMessage('Enregistrement du brouillon...');
    setFeedback(null);
    try {
      const res = await fetch('/api/studio/draft', {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ draft: nextDraft }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Échec de sauvegarde.');
      setStudioState(data);
      if (msg) setFeedback({ type: 'ok', text: msg });
    } catch (err) {
      setFeedback({
        type: 'err',
        text: err instanceof Error ? err.message : 'Erreur lors de la sauvegarde.',
      });
    } finally {
      setBusyMessage('');
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    setBusyMessage('Optimisation et envoi de l’image...');
    const compressed = await compressImageFile(file);
    const res = await fetch('/api/studio/upload', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        kind: 'image',
        filename: file.name,
        dataUrl: compressed,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Échec de l'envoi.");
    return data.url as string;
  };

  const handleSlotUpload = async (slot: 'portrait' | 'artisticPhoto', file: File) => {
    if (!studioState) return;
    try {
      const url = await uploadImage(file);
      const asset: MediaAsset = {
        id: `${slot}-${Date.now()}`,
        url,
        alt:
          slot === 'portrait'
            ? 'Portrait naturel de Cédrine Pigeon-Schneider'
            : 'Portrait artistique maquillage de Cédrine Pigeon-Schneider',
        caption: slot === 'portrait' ? 'Cédrine' : 'Touche artistique',
        updatedAt: new Date().toISOString(),
      };
      const nextDraft: PortfolioData = {
        ...studioState.draft,
        [slot]: asset,
      };
      await saveDraft(
        nextDraft,
        'Image enregistrée en brouillon. Cliquez sur « Publier en un clic » pour la mettre en ligne.'
      );
    } catch (err) {
      setBusyMessage('');
      setFeedback({ type: 'err', text: err instanceof Error ? err.message : 'Erreur upload.' });
    }
  };

  const handleSlotMetaChange = (
    slot: 'portrait' | 'artisticPhoto',
    field: 'alt' | 'caption',
    val: string
  ) => {
    if (!studioState || !studioState.draft[slot]) return;
    const current = studioState.draft[slot]!;
    const nextDraft: PortfolioData = {
      ...studioState.draft,
      [slot]: { ...current, [field]: val },
    };
    setStudioState({ ...studioState, draft: nextDraft, hasUnpublishedChanges: true });
  };

  const handleProjectImageUpload = async (projectId: string, file: File) => {
    if (!studioState) return;
    try {
      const url = await uploadImage(file);
      const asset: MediaAsset = {
        id: `vis-${Date.now()}`,
        url,
        alt: `Visuel du projet — ${file.name.replace(/\.[^.]+$/, '')}`,
        caption: file.name.replace(/\.[^.]+$/, ''),
        updatedAt: new Date().toISOString(),
      };
      const nextProjects = studioState.draft.projects.map((p) =>
        p.id === projectId ? { ...p, visuals: [...p.visuals, asset] } : p
      );
      await saveDraft(
        { ...studioState.draft, projects: nextProjects },
        'Visuel ajouté au projet (brouillon).'
      );
    } catch (err) {
      setBusyMessage('');
      setFeedback({ type: 'err', text: err instanceof Error ? err.message : 'Erreur upload.' });
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studioState || !newProjectTitle.trim()) return;
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: newProjectTitle.trim(),
      category: newProjectCat,
      context: 'Création personnelle',
      role: newProjectRole.trim() || 'Conception et direction artistique',
      challenge: newProjectChallenge.trim() || 'Donner forme à une identité visuelle claire et expressive.',
      idea: newProjectIdea.trim() || 'Explorer des formats visuels sur mesure entre scrapbook et design moderne.',
      deliverables: ['Création visuelle'],
      accentColor: 'pink',
      featured: true,
      visuals: [],
    };
    const nextDraft = {
      ...studioState.draft,
      projects: [newProj, ...studioState.draft.projects],
    };
    setSelectedProjectId(newProj.id);
    setNewProjectTitle('');
    setNewProjectRole('');
    setNewProjectChallenge('');
    setNewProjectIdea('');
    await saveDraft(nextDraft, 'Nouveau projet créé ! Vous pouvez maintenant y importer vos visuels.');
  };

  const handleCvUpload = async (file: File) => {
    if (!studioState) return;
    setBusyMessage('Envoi du CV PDF...');
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const res = await fetch('/api/studio/upload', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ kind: 'cv', filename: file.name, dataUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Échec upload CV.');
      await loadStudioState();
      setFeedback({ type: 'ok', text: 'Votre CV PDF personnalisé est prêt à être publié !' });
    } catch (err) {
      setFeedback({ type: 'err', text: err instanceof Error ? err.message : 'Erreur CV.' });
    } finally {
      setBusyMessage('');
    }
  };

  const handlePublish = async () => {
    setBusyMessage('Publication en cours...');
    setFeedback(null);
    try {
      const res = await fetch('/api/studio/publish', {
        method: 'POST',
        headers: getHeaders(),
      });
      const data = (await res.json()) as StudioState;
      if (!res.ok) throw new Error('Échec de publication.');
      setStudioState(data);
      onPublishedUpdate(data.published);
      setFeedback({ type: 'ok', text: 'Portfolio publié en ligne ! Tous les visiteurs voient vos nouveautés.' });
    } catch (err) {
      setFeedback({ type: 'err', text: err instanceof Error ? err.message : 'Erreur publication.' });
    } finally {
      setBusyMessage('');
    }
  };

  if (!open) return null;

  const selectedProject = studioState?.draft.projects.find((p) => p.id === selectedProjectId);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Espace privé de Cédrine"
      className="fixed inset-0 z-[110] flex items-center justify-center bg-[#252525]/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-[32px] border border-white bg-[#FFFDF9] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between gap-4 border-b border-[#252525]/10 bg-[#F5EBDD]/70 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#252525] text-white">
              <Lock className="h-4 w-4" />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold text-[#252525]">
                Espace privé de Cédrine
              </h2>
              <p className="text-xs text-[#252525]/70">
                Gérez vos photos, créations et publiez en un clic
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {authenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#252525]/15 bg-white px-3.5 py-1.5 text-xs font-medium text-[#252525] hover:bg-[#F5EBDD] cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Verrouiller</span>
              </button>
            )}
            <button
              type="button"
              aria-label="Fermer l'espace privé"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#252525] shadow-xs hover:bg-[#E7A49B]/25 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {statusLoading ? (
            <p className="py-12 text-center text-sm text-[#252525]/70">Chargement de votre espace...</p>
          ) : !authenticated ? (
            <form onSubmit={handleAuthSubmit} className="mx-auto max-w-md py-8">
              <div className="rounded-[24px] border border-[#252525]/10 bg-[#F5EBDD]/55 p-6">
                <KeyRound className="h-7 w-7 text-[#C94F7C]" />
                <h3 className="font-display mt-3 text-2xl font-bold text-[#252525]">
                  {isInitialized ? 'Accès réservé à Cédrine' : 'Créer votre code d’accès'}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#252525]/80">
                  {isInitialized
                    ? 'Saisissez votre code personnel pour ajouter, modifier ou publier vos visuels.'
                    : 'Première ouverture : définissez un code d’accès personnel (minimum 4 caractères) pour verrouiller cet espace.'}
                </p>

                <label className="mt-5 block text-xs font-semibold text-[#252525]">
                  Code d&rsquo;accès personnel
                </label>
                <input
                  type="password"
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  placeholder="••••••"
                  autoFocus
                  className="mt-1.5 w-full rounded-2xl border border-[#252525]/20 bg-white px-4 py-3 text-sm text-[#252525] focus:border-[#C94F7C] focus:outline-none"
                />

                {authError && (
                  <p className="mt-2.5 text-xs font-medium text-[#C94F7C]">{authError}</p>
                )}

                <button
                  type="submit"
                  className="mt-5 w-full rounded-full bg-[#252525] py-3 text-sm font-semibold text-white hover:bg-[#383838] cursor-pointer"
                >
                  {isInitialized ? 'Déverrouiller mon espace' : 'Enregistrer et entrer'}
                </button>
              </div>
            </form>
          ) : (
            studioState && (
              <div>
                {/* Publish Banner */}
                <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#252525]/10 bg-[#F5EBDD]/60 p-4 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 shrink-0 text-[#C94F7C]" />
                    <div>
                      <p className="text-sm font-semibold text-[#252525]">
                        {studioState.hasUnpublishedChanges
                          ? 'Modifications en attente dans le brouillon'
                          : 'Votre portfolio public est à jour'}
                      </p>
                      <p className="text-xs text-[#252525]/65">
                        {busyMessage ||
                          (studioState.published.publishedAt
                            ? `Dernière publication : ${new Date(
                                studioState.published.publishedAt
                              ).toLocaleString('fr-FR')}`
                            : 'Aucune publication personnalisée pour le moment')}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handlePublish}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#C94F7C] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-transform hover:scale-[1.02] hover:bg-[#b23b68] whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Rocket className="h-4 w-4" />
                    <span>Publier en un clic</span>
                  </button>
                </div>

                {feedback && (
                  <div
                    className={`mt-4 flex items-center gap-2 rounded-2xl px-4 py-3 text-xs font-medium ${
                      feedback.type === 'ok'
                        ? 'bg-[#D9E1CC]/70 text-[#252525]'
                        : 'bg-[#E7A49B]/40 text-[#252525]'
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>{feedback.text}</span>
                  </div>
                )}

                {/* Navigation Tabs */}
                <div className="mt-6 flex flex-wrap gap-2 border-b border-[#252525]/10 pb-3">
                  {[
                    { id: 'portraits', label: 'Portraits Hero & À propos' },
                    { id: 'projects', label: 'Projets & Créations' },
                    { id: 'cv', label: 'CV PDF & Code d’accès' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                        activeTab === tab.id
                          ? 'bg-[#252525] text-white'
                          : 'bg-[#F5EBDD]/60 text-[#252525]/80 hover:bg-[#F5EBDD]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab 1: Portraits */}
                {activeTab === 'portraits' && (
                  <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {(
                      [
                        {
                          key: 'portrait' as const,
                          title: 'Portrait naturel',
                          desc: 'Affiché dans le Hero et la section « Hello, it’s me! ».',
                        },
                        {
                          key: 'artisticPhoto' as const,
                          title: 'Photo artistique maquillage',
                          desc: 'Collage incliné à côté du portrait principal.',
                        },
                      ] as const
                    ).map((slot) => {
                      const asset = studioState.draft[slot.key];
                      return (
                        <div
                          key={slot.key}
                          className="rounded-[24px] border border-[#252525]/10 bg-white p-5 shadow-xs"
                        >
                          <h4 className="font-display text-lg font-bold text-[#252525]">
                            {slot.title}
                          </h4>
                          <p className="mt-1 text-xs text-[#252525]/70">{slot.desc}</p>

                          <div className="mt-4 aspect-[4/3] overflow-hidden rounded-2xl bg-[#F5EBDD]">
                            {asset ? (
                              <img
                                src={asset.url}
                                alt={asset.alt}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs text-[#252525]/60">
                                Aucune photo importée
                              </div>
                            )}
                          </div>

                          {asset && (
                            <div className="mt-3 space-y-2">
                              <input
                                type="text"
                                value={asset.caption || ''}
                                onChange={(e) =>
                                  handleSlotMetaChange(slot.key, 'caption', e.target.value)
                                }
                                placeholder="Légende manuscrite"
                                className="w-full rounded-xl border border-[#252525]/15 px-3 py-2 text-xs"
                              />
                              <input
                                type="text"
                                value={asset.alt}
                                onChange={(e) =>
                                  handleSlotMetaChange(slot.key, 'alt', e.target.value)
                                }
                                placeholder="Description SEO (balise alt)"
                                className="w-full rounded-xl border border-[#252525]/15 px-3 py-2 text-xs"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  saveDraft(
                                    studioState.draft,
                                    'Légende et description enregistrées en brouillon.'
                                  )
                                }
                                className="rounded-full bg-[#F5EBDD] px-3.5 py-1.5 text-xs font-semibold text-[#252525] cursor-pointer"
                              >
                                Enregistrer le texte
                              </button>
                            </div>
                          )}

                          <div className="mt-4 flex flex-wrap gap-2">
                            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#252525] px-4 py-2 text-xs font-semibold text-white hover:bg-[#383838]">
                              <ImagePlus className="h-3.5 w-3.5" />
                              <span>{asset ? 'Remplacer' : 'Importer une photo'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) handleSlotUpload(slot.key, f);
                                  e.target.value = '';
                                }}
                              />
                            </label>

                            {asset && (
                              <button
                                type="button"
                                onClick={() =>
                                  saveDraft(
                                    { ...studioState.draft, [slot.key]: null },
                                    'Photo retirée du brouillon.'
                                  )
                                }
                                className="inline-flex items-center gap-1.5 rounded-full border border-[#252525]/15 px-3.5 py-2 text-xs font-medium text-[#C94F7C] hover:bg-[#E7A49B]/15 cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>Supprimer</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Tab 2: Projects */}
                {activeTab === 'projects' && (
                  <div className="mt-6 space-y-6">
                    <div className="rounded-[24px] border border-[#252525]/10 bg-white p-5">
                      <label className="text-xs font-semibold text-[#252525]">
                        Choisir un projet pour ajouter / supprimer ses visuels
                      </label>
                      <select
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                        className="mt-2 w-full rounded-xl border border-[#252525]/15 bg-[#F5EBDD]/40 px-4 py-2.5 text-sm font-medium text-[#252525]"
                      >
                        {studioState.draft.projects.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.title} ({p.visuals.length} visuel{p.visuals.length > 1 ? 's' : ''})
                          </option>
                        ))}
                      </select>

                      {selectedProject && (
                        <div className="mt-5">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-[#252525]">
                              Visuels de « {selectedProject.title} »
                            </p>
                            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#252525] px-4 py-2 text-xs font-semibold text-white">
                              <Upload className="h-3.5 w-3.5" />
                              <span>Ajouter un visuel</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) handleProjectImageUpload(selectedProject.id, f);
                                  e.target.value = '';
                                }}
                              />
                            </label>
                          </div>

                          {selectedProject.visuals.length === 0 ? (
                            <p className="mt-3 text-xs text-[#252525]/65">
                              Aucun visuel attaché pour le moment. Importez vos affiches, posts,
                              carrousels ou présentations.
                            </p>
                          ) : (
                            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                              {selectedProject.visuals.map((vis) => (
                                <div
                                  key={vis.id}
                                  className="rounded-2xl border border-[#252525]/10 p-2.5"
                                >
                                  <img
                                    src={vis.url}
                                    alt={vis.alt}
                                    className="aspect-[4/3] w-full rounded-xl object-cover"
                                  />
                                  <input
                                    type="text"
                                    value={vis.caption || ''}
                                    onChange={(e) => {
                                      const nextProjects = studioState.draft.projects.map((p) =>
                                        p.id === selectedProject.id
                                          ? {
                                              ...p,
                                              visuals: p.visuals.map((v) =>
                                                v.id === vis.id
                                                  ? { ...v, caption: e.target.value, alt: e.target.value }
                                                  : v
                                              ),
                                            }
                                          : p
                                      );
                                      setStudioState({
                                        ...studioState,
                                        draft: { ...studioState.draft, projects: nextProjects },
                                        hasUnpublishedChanges: true,
                                      });
                                    }}
                                    placeholder="Légende"
                                    className="mt-2 w-full rounded-lg border border-[#252525]/15 px-2 py-1 text-xs"
                                  />
                                  <div className="mt-2 flex items-center justify-between gap-2">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        saveDraft(studioState.draft, 'Légende mise à jour.')
                                      }
                                      className="text-[11px] font-semibold text-[#252525] underline cursor-pointer"
                                    >
                                      Sauver
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const nextProjects = studioState.draft.projects.map((p) =>
                                          p.id === selectedProject.id
                                            ? {
                                                ...p,
                                                visuals: p.visuals.filter((v) => v.id !== vis.id),
                                              }
                                            : p
                                        );
                                        saveDraft(
                                          { ...studioState.draft, projects: nextProjects },
                                          'Visuel supprimé du projet.'
                                        );
                                      }}
                                      className="text-[11px] font-semibold text-[#C94F7C] cursor-pointer"
                                    >
                                      Supprimer
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Add a new project card */}
                    <form
                      onSubmit={handleCreateProject}
                      className="rounded-[24px] border border-[#252525]/10 bg-white p-5"
                    >
                      <h4 className="font-display flex items-center gap-2 text-lg font-bold text-[#252525]">
                        <Plus className="h-4 w-4 text-[#C94F7C]" />
                        <span>Créer une nouvelle fiche projet</span>
                      </h4>
                      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <input
                          type="text"
                          required
                          value={newProjectTitle}
                          onChange={(e) => setNewProjectTitle(e.target.value)}
                          placeholder="Titre du projet (ex. Affiche campagne culturelle)"
                          className="rounded-xl border border-[#252525]/15 px-3.5 py-2.5 text-sm"
                        />
                        <select
                          value={newProjectCat}
                          onChange={(e) => setNewProjectCat(e.target.value as ProjectCategory)}
                          className="rounded-xl border border-[#252525]/15 px-3.5 py-2.5 text-sm"
                        >
                          <option value="Créations visuelles">Créations visuelles</option>
                          <option value="Contenus & Réseaux">Contenus &amp; Réseaux</option>
                          <option value="Stratégie & KPI">Stratégie &amp; KPI</option>
                          <option value="Communication & Événements">
                            Communication &amp; Événements
                          </option>
                        </select>
                        <input
                          type="text"
                          value={newProjectRole}
                          onChange={(e) => setNewProjectRole(e.target.value)}
                          placeholder="Mon rôle"
                          className="rounded-xl border border-[#252525]/15 px-3.5 py-2.5 text-sm"
                        />
                        <input
                          type="text"
                          value={newProjectChallenge}
                          onChange={(e) => setNewProjectChallenge(e.target.value)}
                          placeholder="Le défi"
                          className="rounded-xl border border-[#252525]/15 px-3.5 py-2.5 text-sm"
                        />
                        <input
                          type="text"
                          value={newProjectIdea}
                          onChange={(e) => setNewProjectIdea(e.target.value)}
                          placeholder="Mon idée"
                          className="rounded-xl border border-[#252525]/15 px-3.5 py-2.5 text-sm sm:col-span-2"
                        />
                      </div>
                      <button
                        type="submit"
                        className="mt-4 rounded-full bg-[#252525] px-5 py-2.5 text-xs font-semibold text-white cursor-pointer"
                      >
                        Ajouter le projet au brouillon
                      </button>
                    </form>
                  </div>
                )}

                {/* Tab 3: CV & Security */}
                {activeTab === 'cv' && (
                  <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="rounded-[24px] border border-[#252525]/10 bg-white p-5">
                      <FileText className="h-6 w-6 text-[#C94F7C]" />
                      <h4 className="font-display mt-3 text-lg font-bold text-[#252525]">
                        Importer votre CV officiel (PDF)
                      </h4>
                      <p className="mt-1.5 text-xs leading-relaxed text-[#252525]/75">
                        Par défaut, le site génère un CV PDF propre à partir de votre parcours.
                        Vous pouvez importer ici votre propre fichier{' '}
                        <strong>CV_de_Cédrine_PIGEON-SCHNEIDER.pdf</strong>.
                      </p>
                      <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#252525] px-5 py-2.5 text-xs font-semibold text-white">
                        <Upload className="h-4 w-4" />
                        <span>Choisir un fichier PDF</span>
                        <input
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleCvUpload(f);
                            e.target.value = '';
                          }}
                        />
                      </label>
                    </div>

                    <div className="rounded-[24px] border border-[#252525]/10 bg-white p-5">
                      <KeyRound className="h-6 w-6 text-[#252525]" />
                      <h4 className="font-display mt-3 text-lg font-bold text-[#252525]">
                        Modifier votre code d&rsquo;accès
                      </h4>
                      <p className="mt-1.5 text-xs leading-relaxed text-[#252525]/75">
                        Changez votre code personnel à tout moment (minimum 4 caractères).
                      </p>
                      <div className="mt-4 flex gap-2">
                        <input
                          type="password"
                          value={newPasscode}
                          onChange={(e) => setNewPasscode(e.target.value)}
                          placeholder="Nouveau code"
                          className="flex-1 rounded-xl border border-[#252525]/15 px-3 py-2 text-sm"
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            const res = await fetch('/api/studio/passcode', {
                              method: 'POST',
                              headers: getHeaders(),
                              body: JSON.stringify({ newPasscode }),
                            });
                            const data = await res.json();
                            if (res.ok) {
                              setNewPasscode('');
                              setFeedback({ type: 'ok', text: 'Code d’accès mis à jour.' });
                            } else {
                              setFeedback({ type: 'err', text: data.error });
                            }
                          }}
                          className="rounded-full bg-[#252525] px-4 py-2 text-xs font-semibold text-white cursor-pointer"
                        >
                          Valider
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
