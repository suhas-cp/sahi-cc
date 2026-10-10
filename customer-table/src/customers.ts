export type CustomerStatus = "active" | "inactive";

export interface Customer {
  id: string;
  name: string;
  status: CustomerStatus;
}

// Sample data. Replace with real customers or a fetch from your API.
export const customers: Customer[] = [
  { id: "CUST-1001", name: "Aarav Sharma", status: "active" },
  { id: "CUST-1002", name: "Priya Nair", status: "active" },
  { id: "CUST-1003", name: "Rohan Mehta", status: "inactive" },
  { id: "CUST-1004", name: "Ananya Iyer", status: "active" },
  { id: "CUST-1005", name: "Vikram Singh", status: "inactive" },
  { id: "CUST-1006", name: "Meera Krishnan", status: "active" },
  { id: "CUST-1007", name: "Kabir Joshi", status: "active" },
  { id: "CUST-1008", name: "Sneha Reddy", status: "inactive" },
  { id: "CUST-1009", name: "Arjun Patel", status: "active" },
  { id: "CUST-1010", name: "Ishita Banerjee", status: "active" },
  { id: "CUST-1011", name: "Dev Malhotra", status: "inactive" },
  { id: "CUST-1012", name: "Kavya Rao", status: "active" },
];
