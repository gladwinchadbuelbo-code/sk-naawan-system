// Type definitions for reports

export interface LiquidationReport {
  id: number;
  eventId?: number;
  eventTitle: string;
  eventDate: string;
  venue: string;
  time: string;
  officers: {
    chairperson: string;
    treasurer: string;
    secretary: string;
  };
  approvedBudget: number;
  actualExpenses: number;
  variance: number;
  expenses: ExpenseItem[];
  receipts: Receipt[];
  attendance: {
    total: number;
    present: number;
    percentage: number;
  };
  preparedBy: string;
  position: string;
  dateCreated: string;
  status: 'Draft' | 'Submitted' | 'Approved';
  createdBy: string;
}

export interface ExpenseItem {
  id: number;
  date: string;
  category: string;
  description: string;
  orNumber: string;
  amount: number;
  supplier: string;
  hasReceipt?: boolean;
  receiptFileName?: string;
  receiptUrl?: string;
}

export interface Receipt {
  id: number;
  name: string;
  category: string;
  url?: string;
}

export interface AccomplishmentReport {
  id: number;
  eventId?: number;
  eventTitle: string;
  eventDate: string;
  eventType: string;
  venue: string;
  time: string;
  objectives: string[];
  activities: ActivitySchedule[];
  participants: {
    total: number;
    male: number;
    female: number;
    ageBreakdown: Record<string, number>;
  };
  outputs: string[];
  outcomes: string[];
  photos: string[];
  preparedBy: string;
  position: string;
  approvedBy?: string;
  approverPosition?: string;
  dateCreated: string;
  status: 'Draft' | 'Submitted' | 'Approved';
  createdBy: string;
}

export interface ActivitySchedule {
  time: string;
  activity: string;
}

export interface BudgetReport {
  id: number;
  title: string;
  date: string;
  type: string;
  status: string;
  period: string;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  createdBy: string;
}