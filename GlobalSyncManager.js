// Global Sync Manager using Firebase Realtime Database
// This will keep all users synchronized

class GlobalSyncManager {
    constructor() {
        this.db = null;
        this.isConnected = false;
        this.localStoragePrefix = 'local-';
        this.setupFirebase();
    }

    async setupFirebase() {
        // Initialize Firebase (you'll need to add Firebase to your HTML)
        // For now, this is a placeholder for the Firebase setup
        
        // Firebase config - you'll need to replace this with your actual config
        const firebaseConfig = {
            // Your Firebase config goes here
            // Get this from Firebase Console > Project Settings > Firebase config
            databaseURL: "https://your-project-id-default-rtdb.firebaseio.com/"
        };

        try {
            // Import Firebase (this would be done via script tags in HTML)
            // firebase.initializeApp(firebaseConfig);
            // this.db = firebase.database();
            
            // For now, we'll use localStorage as fallback
            this.isConnected = false;
            console.log('Firebase not configured - using localStorage');
        } catch (error) {
            console.error('Firebase setup failed:', error);
            this.isConnected = false;
        }
    }

    async getGlobalPoints() {
        if (this.isConnected && this.db) {
            try {
                const snapshot = await this.db.ref('globalPoints').once('value');
                return snapshot.val() || 0;
            } catch (error) {
                console.error('Error getting global points:', error);
                return this.getLocalPoints();
            }
        }
        return this.getLocalPoints();
    }

    async setGlobalPoints(points) {
        if (this.isConnected && this.db) {
            try {
                await this.db.ref('globalPoints').set(points);
                this.setLocalPoints(points);
                return true;
            } catch (error) {
                console.error('Error setting global points:', error);
                this.setLocalPoints(points);
                return false;
            }
        }
        this.setLocalPoints(points);
        return true;
    }

    async getTalentTreeState(treeName) {
        if (this.isConnected && this.db) {
            try {
                const snapshot = await this.db.ref(`talentTrees/${treeName}`).once('value');
                return snapshot.val();
            } catch (error) {
                console.error('Error getting talent tree state:', error);
                return this.getLocalTalentState(treeName);
            }
        }
        return this.getLocalTalentState(treeName);
    }

    async setTalentTreeState(treeName, state) {
        if (this.isConnected && this.db) {
            try {
                await this.db.ref(`talentTrees/${treeName}`).set(state);
                this.setLocalTalentState(treeName, state);
                return true;
            } catch (error) {
                console.error('Error setting talent tree state:', error);
                this.setLocalTalentState(treeName, state);
                return false;
            }
        }
        this.setLocalTalentState(treeName, state);
        return true;
    }

    // Local storage methods (fallback)
    getLocalPoints() {
        return parseInt(localStorage.getItem('global-talent-points')) || 0;
    }

    setLocalPoints(points) {
        localStorage.setItem('global-talent-points', points.toString());
    }

    getLocalTalentState(treeName) {
        const saved = localStorage.getItem(`${treeName}-talent-tree`);
        return saved ? JSON.parse(saved) : null;
    }

    setLocalTalentState(treeName, state) {
        localStorage.setItem(`${treeName}-talent-tree`, JSON.stringify(state));
    }

    // Listen for changes
    onGlobalPointsChange(callback) {
        if (this.isConnected && this.db) {
            this.db.ref('globalPoints').on('value', (snapshot) => {
                const points = snapshot.val() || 0;
                callback(points);
            });
        } else {
            // Fallback: listen for localStorage changes
            window.addEventListener('storage', (event) => {
                if (event.key === 'global-talent-points') {
                    callback(parseInt(event.newValue) || 0);
                }
            });
        }
    }

    onTalentTreeChange(treeName, callback) {
        if (this.isConnected && this.db) {
            this.db.ref(`talentTrees/${treeName}`).on('value', (snapshot) => {
                const state = snapshot.val();
                callback(state);
            });
        } else {
            // Fallback: listen for localStorage changes
            window.addEventListener('storage', (event) => {
                if (event.key === `${treeName}-talent-tree`) {
                    callback(JSON.parse(event.newValue));
                }
            });
        }
    }
}

// Export for use in other files
export default GlobalSyncManager;