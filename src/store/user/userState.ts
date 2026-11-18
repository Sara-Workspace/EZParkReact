export interface UserState {
  userId: number | null;
  role: 'Admin' | 'Owner' | 'Driver' | null;
  firstName: string;
  lastName: string;
  points: number;              // 👛 יתרת הארנק בשקלים (השם נשאר מהשיטה הישנה של נקודות)
  licensePlate: string | null;
}

// מצב "ריק" - כשאף משתמש לא מחובר
export const emptyState: UserState = {
  userId: null,
  role: null,
  firstName: '',
  lastName: '',
  points: 0,
  licensePlate: null,
};

// Redux שוכח הכול ברענון הדף, ולכן שומרים עותק ב-localStorage וקוראים אותו בהתחלה
function loadInitialState(): UserState {
  try {
    const saved = localStorage.getItem('user');
    if (saved === null) return emptyState;
    return { ...emptyState, ...(JSON.parse(saved) as Partial<UserState>) };
  } catch {
    return emptyState;
  }
}

export const initialState: UserState = loadInitialState();