// Simple GitHub Sync - No tokens in code!
import { CONFIG } from './config.js';

class SimpleGitHubSync {
    constructor() {
        // Get values from config file (not in code!)
        this.username = CONFIG.GITHUB_USERNAME;
        this.repo = CONFIG.GITHUB_REPO;
        this.token = CONFIG.GITHUB_TOKEN;
        
        this.dataFile = 'data.json';
        this.apiUrl = `https://api.github.com/repos/${this.username}/${this.repo}/contents/${this.dataFile}`;
        this.lastSha = null;
    }

    async loadData() {
        try {
            const response = await fetch(this.apiUrl);
            if (response.ok) {
                const fileInfo = await response.json();
                this.lastSha = fileInfo.sha;
                const content = JSON.parse(atob(fileInfo.content));
                console.log('✅ Loaded data from GitHub');
                return content;
            }
        } catch (error) {
            console.log('⚠️ GitHub sync failed, using local data');
        }
        
        // Fallback to localStorage
        return this.getLocalData();
    }

    async saveData(data) {
        try {
            const content = btoa(JSON.stringify(data, null, 2));
            const body = {
                message: `Update from ${new Date().toLocaleString()}`,
                content: content
            };
            
            if (this.lastSha) {
                body.sha = this.lastSha;
            }

            const response = await fetch(this.apiUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                const result = await response.json();
                this.lastSha = result.content.sha;
                console.log('✅ Saved data to GitHub');
                return true;
            }
        } catch (error) {
            console.log('⚠️ GitHub save failed');
        }
        
        // Fallback to localStorage
        this.saveLocalData(data);
        return false;
    }

    getLocalData() {
        const saved = localStorage.getItem('global-game-data');
        return saved ? JSON.parse(saved) : {
            globalPoints: 10,
            talentTrees: {},
            lastUpdated: new Date().toISOString()
        };
    }

    saveLocalData(data) {
        localStorage.setItem('global-game-data', JSON.stringify(data));
    }
}

// Easy-to-use functions
let syncManager = new SimpleGitHubSync();
let gameData = null;

export async function initSync() {
    gameData = await syncManager.loadData();
    
    // Auto-sync every 30 seconds
    setInterval(async () => {
        const freshData = await syncManager.loadData();
        if (freshData.lastUpdated !== gameData.lastUpdated) {
            gameData = freshData;
            // Notify that data changed
            window.dispatchEvent(new CustomEvent('dataChanged', { detail: gameData }));
        }
    }, 30000);
}

export async function getGlobalPoints() {
    if (!gameData) gameData = await syncManager.loadData();
    return gameData.globalPoints || 0;
}

export async function setGlobalPoints(points) {
    if (!gameData) gameData = await syncManager.loadData();
    gameData.globalPoints = points;
    gameData.lastUpdated = new Date().toISOString();
    await syncManager.saveData(gameData);
}

export async function getTalentTree(treeName) {
    if (!gameData) gameData = await syncManager.loadData();
    return gameData.talentTrees[treeName] || {};
}

export async function saveTalentTree(treeName, treeData) {
    if (!gameData) gameData = await syncManager.loadData();
    gameData.talentTrees[treeName] = treeData;
    gameData.lastUpdated = new Date().toISOString();
    await syncManager.saveData(gameData);
}