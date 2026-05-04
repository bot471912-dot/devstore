/**
 * AppStore - Application de Bibliothèque d'Applications
 * Fonctionnalités :
 * - Afficher les applications sous forme de cartes
 * - Ajouter/Supprimer des applications avec modal
 * - Sauvegarder les données avec localStorage
 * - Envoyer des webhooks pour chaque action
 * - Rechercher les applications
 * - Page de détail pour chaque application
 */

// ========================================
// CONFIGURATION ET CONSTANTES
// ========================================

const STORAGE_KEY = 'appstore_apps';
const WEBHOOK_URL = 'https://webhook.site/your-unique-id'; // À configurer dans admin.html

const DEFAULT_SAMPLE_APPS = [
    {
        name: 'GitHub',
        description: 'Plateforme de contrôle de version et de collaboration pour les développeurs.',
        url: 'https://github.com',
        imageUrl: 'https://github.githubassets.com/favicons/favicon.png',
        downloadUrl: 'https://example.com/download/github-cli.zip'
    },
    {
        name: 'Visual Studio Code',
        description: 'Éditeur de code léger et puissant avec support pour de nombreux langages et extensions.',
        url: 'https://code.visualstudio.com',
        imageUrl: 'https://code.visualstudio.com/favicon.ico',
        downloadUrl: 'https://example.com/download/vscode.zip'
    }
];

// ========================================
// SÉLECTEURS DOM
// ========================================

const appForm = document.getElementById('appForm');
const appsList = document.getElementById('appsList');
const emptyState = document.getElementById('emptyState');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const searchInput = document.getElementById('searchInput');

// Éléments de la modal
const formModal = document.getElementById('formModal');
const openFormBtn = document.getElementById('openFormBtn');
const closeFormBtn = document.getElementById('closeFormBtn');
const cancelFormBtn = document.getElementById('cancelFormBtn');

// ========================================
// CLASSE APPLICATION
// ========================================

class App {
    constructor(name, description, url, imageUrl, downloadUrl) {
        this.id = Date.now();
        this.name = name;
        this.description = description;
        this.url = url;
        this.imageUrl = imageUrl;
        this.downloadUrl = downloadUrl;
        this.dateAdded = new Date().toLocaleString('fr-FR');
    }

    toWebhookPayload(action = 'added') {
        return {
            action: action,
            app: {
                id: this.id,
                name: this.name,
                description: this.description,
                url: this.url,
                imageUrl: this.imageUrl,
                downloadUrl: this.downloadUrl,
                dateAdded: this.dateAdded,
                timestamp: new Date().toISOString()
            }
        };
    }
}

// ========================================
// GESTION DU STOCKAGE (localStorage)
// ========================================

function loadApps() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Erreur lors du chargement des applications:', error);
        showError('Erreur lors du chargement des données');
        return [];
    }
}

function saveApps(apps) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
    } catch (error) {
        console.error('Erreur lors de la sauvegarde des applications:', error);
        showError('Erreur lors de la sauvegarde des données');
    }
}

// ========================================
// GESTION DE LA MODAL
// ========================================

function openForm() {
    formModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeForm() {
    formModal.classList.remove('show');
    document.body.style.overflow = 'auto';
    appForm.reset();
    successMessage.classList.remove('show');
    errorMessage.classList.remove('show');
}

if (openFormBtn) openFormBtn.addEventListener('click', openForm);
if (closeFormBtn) closeFormBtn.addEventListener('click', closeForm);
if (cancelFormBtn) cancelFormBtn.addEventListener('click', closeForm);

// Fermer la modal en cliquant en dehors
formModal?.addEventListener('click', (e) => {
    if (e.target === formModal) {
        closeForm();
    }
});

// ========================================
// WEBHOOKS
// ========================================

async function sendWebhook(action, payload) {
    // Utiliser l'URL du webhook configurée dans le code
    const webhookUrl = WEBHOOK_URL;

    if (!webhookUrl) {
        console.warn('URL du webhook non configurée.');
        return { success: false, error: 'Webhook URL not configured' };
    }

    try {
        const fullPayload = {
            action: action,
            timestamp: new Date().toISOString(),
            ...payload
        };

        console.log('Envoi du webhook:', action, fullPayload);

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(fullPayload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log('Webhook envoyé avec succès');
        return { success: true };
    } catch (error) {
        console.error('Erreur lors de l\'envoi du webhook:', error);
        showError(`Erreur webhook: ${error.message}`);
        return { success: false, error: error.message };
    }
}

// ========================================
// INTERFACE UTILISATEUR
// ========================================

function showSuccess(message) {
    if (successMessage) {
        successMessage.textContent = message;
        successMessage.classList.add('show');
        if (errorMessage) errorMessage.classList.remove('show');
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 4000);
    }
}

function showError(message) {
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
        if (successMessage) successMessage.classList.remove('show');
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 4000);
    }
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function createAppCard(app) {
    const card = document.createElement('div');
    card.className = 'app-card';
    card.dataset.appId = app.id;
    card.dataset.searchText = `${app.name} ${app.description}`.toLowerCase();

    card.innerHTML = `
        <div class="app-header">
            <div class="app-name">${escapeHtml(app.name)}</div>
            <div class="app-url">${escapeHtml(app.url)}</div>
        </div>
        <div class="app-body">
            <p class="app-description">${escapeHtml(app.description)}</p>
            <p class="app-date">Ajoutée le: ${escapeHtml(app.dateAdded)}</p>
        </div>
        <div class="app-footer">
            <button class="btn-card btn-launch" data-action="view-detail">👁️ Voir détails</button>
            <button class="btn-card btn-report" data-action="report">🚩 Signaler</button>
        </div>
    `;

    card.querySelector('[data-action="view-detail"]').addEventListener('click', () => {
        window.location.href = `app-detail.html?id=${app.id}`;
        sendWebhook('view', { app: app });
    });

    card.querySelector('[data-action="report"]').addEventListener('click', () => {
        reportApp(app.id, app);
    });

    return card;
}

function renderApps(appsToRender = null) {
    if (!appsList) return;
    
    const apps = appsToRender || loadApps();
    appsList.innerHTML = '';

    if (apps.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
    } else {
        if (emptyState) emptyState.style.display = 'none';
        apps.forEach(app => {
            const card = createAppCard(app);
            appsList.appendChild(card);
        });
    }
}

function normalizeApp(app) {
    return {
        id: app.id || Date.now() + Math.floor(Math.random() * 1000),
        name: app.name || 'Application inconnue',
        description: app.description || '',
        url: app.url || '#',
        imageUrl: app.imageUrl || '',
        downloadUrl: app.downloadUrl || '',
        dateAdded: app.dateAdded || new Date().toLocaleString('fr-FR')
    };
}

async function loadSampleApps() {
    try {
        const response = await fetch('sample-apps.json');
        if (!response.ok) {
            throw new Error(`Échec de chargement sample-apps.json: ${response.status}`);
        }
        const sampleApps = await response.json();
        if (Array.isArray(sampleApps)) {
            return sampleApps.map(normalizeApp);
        }
        if (sampleApps && typeof sampleApps === 'object') {
            return [normalizeApp(sampleApps)];
        }
        return DEFAULT_SAMPLE_APPS.map(normalizeApp);
    } catch (error) {
        console.warn('Impossible de charger sample-apps.json, fallback aux données par défaut:', error);
        return DEFAULT_SAMPLE_APPS.map(normalizeApp);
    }
}

async function loadInitialApps() {
    const localApps = loadApps();
    const sampleApps = await loadSampleApps();

    if (localApps.length === 0 && sampleApps.length > 0) {
        saveApps(sampleApps);
        renderApps(sampleApps);
        return;
    }

    const mergedApps = [...localApps];
    sampleApps.forEach(sampleApp => {
        const exists = mergedApps.some(app => app.url === sampleApp.url || app.name === sampleApp.name);
        if (!exists) {
            mergedApps.push(sampleApp);
        }
    });

    if (mergedApps.length !== localApps.length) {
        saveApps(mergedApps);
    }

    renderApps(mergedApps);
}

function deleteApp(appId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette application ?')) {
        return;
    }

    const apps = loadApps();
    const appToDelete = apps.find(app => app.id === appId);
    const updatedApps = apps.filter(app => app.id !== appId);

    saveApps(updatedApps);
    renderApps(updatedApps);
    showSuccess('Application supprimée');

    if (appToDelete) {
        sendWebhook('deleted', {
            app: appToDelete
        });
    }
}

async function reportApp(appId, app) {
    if (!confirm('Signaler cette application ?')) {
        return;
    }

    const result = await sendWebhook('reported', {
        app: app,
        reason: 'User reported'
    });

    if (result.success) {
        showSuccess('Application signalée. Merci !');
    } else {
        showError('Erreur lors du signalement');
    }
}

// ========================================
// FORMULAIRE D'AJOUT D'APPLICATION
// ========================================

if (appForm) {
    appForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('appName').value.trim();
        const description = document.getElementById('appDescription').value.trim();
        const url = document.getElementById('appUrl').value.trim();
        const imageUrl = document.getElementById('appImageUrl').value.trim();
        const downloadUrl = document.getElementById('appDownloadUrl').value.trim();

        if (!name || !description || !url || !imageUrl || !downloadUrl) {
            showError('Veuillez remplir tous les champs');
            return;
        }

        try {
            new URL(url);
            new URL(imageUrl);
            new URL(downloadUrl);
        } catch (error) {
            showError('Une ou plusieurs URLs sont invalides');
            return;
        }

        const newApp = new App(name, description, url, imageUrl, downloadUrl);

        // Envoyer le webhook à l'admin pour validation
        const result = await sendWebhook('create_request', {
            app: newApp,
            user: 'user',
            message: `Nouvelle application soumise pour approbation: ${name}`
        });

        if (result.success) {
            appForm.reset();
            closeForm();
            showSuccess(`✅ Demande envoyée ! L'administrateur validera bientôt votre application.`);
        } else {
            showError('Erreur lors de l\'envoi de la demande');
        }
    });
}

// ========================================
// RECHERCHE
// ========================================

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.app-card');

        cards.forEach(card => {
            const searchText = card.dataset.searchText;
            if (searchText.includes(searchTerm)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// ========================================
// INITIALISATION
// ========================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 AppStore démarrée');
    await loadInitialApps();
    console.log('📊 Applications chargées:', loadApps().length);
});

