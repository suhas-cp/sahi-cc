export type FlowStatus = "built" | "planned";

export interface FlowStep {
  title: string;
  detail: string;
  /** Route of the live screen for this step, when it exists. */
  screen?: string;
  optional?: boolean;
  /** Alternative paths at this step (e.g. payment methods). */
  branches?: { title: string; detail: string }[];
}

export interface Flow {
  id: string;
  title: string;
  actor: string;
  trigger: string;
  outcome: string;
  status: FlowStatus;
  /** Screen this flow lives on. */
  screen: string;
  steps: FlowStep[];
}

export interface FlowGroup {
  title: string;
  description: string;
  flows: Flow[];
}

export const flowGroups: FlowGroup[] = [
  {
    title: "At the counter",
    description: "What the cashier does, in the order a day runs.",
    flows: [
      {
        id: "open",
        title: "Open the store",
        actor: "Cashier",
        trigger: "Start of the day, or a new cashier takes over",
        outcome: "Shift started with a known cash float",
        status: "planned",
        screen: "/shift",
        steps: [
          { title: "Sign in", detail: "Pick your name and enter a 4-digit staff PIN" },
          { title: "Count opening cash", detail: "Enter the float in the drawer, by note" },
          { title: "Start shift", detail: "Opens New sale, ready for the first customer", screen: "/checkout" },
        ],
      },
      {
        id: "sale",
        title: "Ring up a sale",
        actor: "Cashier",
        trigger: "A customer brings items to the counter",
        outcome: "Bill paid, stock reduced, receipt handed over",
        status: "built",
        screen: "/checkout",
        steps: [
          { title: "Find items", detail: "Search by name, scan the barcode, or tap a category", screen: "/checkout" },
          { title: "Build the cart", detail: "Tap to add; change quantity or remove a line", screen: "/checkout" },
          { title: "Add customer", detail: "Mobile number for the bill and repeat visits", screen: "/checkout", optional: true },
          { title: "Apply discount", detail: "Percent or flat ₹ off the whole bill", screen: "/checkout", optional: true },
          { title: "Charge", detail: "Check items, GST and round-off, then take payment", screen: "/checkout" },
          {
            title: "Take payment",
            detail: "Choose how the customer pays",
            screen: "/checkout",
            branches: [
              { title: "UPI", detail: "Customer scans the store QR; confirm the money arrived" },
              { title: "Cash", detail: "Enter cash received; the app shows change to return" },
              { title: "Card", detail: "Customer taps or inserts on the card machine" },
            ],
          },
          { title: "Receipt", detail: "Print the bill and start the next sale", screen: "/checkout" },
        ],
      },
      {
        id: "refund",
        title: "Return or refund",
        actor: "Cashier",
        trigger: "A customer brings an item back",
        outcome: "Money returned, item back on the shelf, refund receipt printed",
        status: "planned",
        screen: "/orders",
        steps: [
          { title: "Find the bill", detail: "By bill number, customer mobile, or date" },
          { title: "Choose items", detail: "Select what's coming back and how many" },
          {
            title: "Refund method",
            detail: "How the customer gets their money back",
            branches: [
              { title: "Original method", detail: "Back to the UPI account or card used" },
              { title: "Cash", detail: "Paid from the drawer; counted at day end" },
              { title: "Store credit", detail: "Saved against the customer's mobile number" },
            ],
          },
          { title: "Restock", detail: "Put sellable items back into stock, or mark them damaged" },
          { title: "Refund receipt", detail: "Print or share the refund slip" },
        ],
      },
      {
        id: "orders",
        title: "Look up a past bill",
        actor: "Cashier or owner",
        trigger: "A customer asks for a copy, or questions a bill",
        outcome: "Bill found and reprinted or shared",
        status: "planned",
        screen: "/orders",
        steps: [
          { title: "Bills list", detail: "Filter by date, payment method or amount" },
          { title: "Open the bill", detail: "Items, GST breakdown, payment and cashier" },
          { title: "Reprint or share", detail: "Print again, or send on WhatsApp or SMS" },
        ],
      },
      {
        id: "close",
        title: "Close the day",
        actor: "Cashier or owner",
        trigger: "End of a shift, or closing time",
        outcome: "Cash counted and the day-end report saved",
        status: "planned",
        screen: "/shift",
        steps: [
          { title: "Count the drawer", detail: "Enter cash in hand, by note" },
          { title: "Compare with expected", detail: "Opening float + cash sales − change − cash refunds" },
          { title: "Explain any difference", detail: "Add a note when the count is short or over" },
          { title: "Day-end report", detail: "Sales by payment method, GST collected, top items" },
          { title: "Close shift", detail: "Locks the day's bills" },
        ],
      },
    ],
  },
  {
    title: "Running the store",
    description: "What the owner checks and changes, usually away from the queue.",
    flows: [
      {
        id: "day",
        title: "See how the day is going",
        actor: "Owner",
        trigger: "Owner opens the app during or after the day",
        outcome: "Knows sales against yesterday, rush hours, and what to reorder",
        status: "built",
        screen: "/",
        steps: [
          { title: "Today at a glance", detail: "Net sales, bills, average bill and items sold, against yesterday at the same time", screen: "/" },
          { title: "Sales by hour", detail: "Today over yesterday, to spot the rush hours", screen: "/" },
          { title: "Payment mix", detail: "UPI, cash and card, so you know the cash to expect in the drawer", screen: "/" },
          { title: "Top items", detail: "Today's best sellers by revenue", screen: "/" },
          { title: "Low-stock alerts", detail: "Items at or below their reorder level", screen: "/" },
          { title: "Restock", detail: "Jump to Inventory, filtered to low stock", screen: "/inventory?stock=reorder" },
        ],
      },
      {
        id: "stock",
        title: "Keep shelves stocked",
        actor: "Owner",
        trigger: "A low-stock alert, or a supplier delivery arrives",
        outcome: "Stock counts match the shelf; new products ready to sell",
        status: "built",
        screen: "/inventory",
        steps: [
          { title: "Browse products", detail: "Search by name or barcode, filter by category", screen: "/inventory" },
          { title: "Find what's running out", detail: "Low stock and out of stock filters", screen: "/inventory?stock=reorder" },
          {
            title: "Update stock",
            detail: "Pick what changed",
            screen: "/inventory",
            branches: [
              { title: "Restock", detail: "Add the quantity received; see the new level" },
              { title: "Add a product", detail: "Name, barcode, category, MRP, GST rate, opening stock, reorder level" },
              { title: "Edit a product", detail: "Change price, GST rate or reorder level" },
            ],
          },
        ],
      },
      {
        id: "customers",
        title: "Regular customers & credit",
        actor: "Owner",
        trigger: "A regular buys on credit (udhaar) or asks about their balance",
        outcome: "Credit balance and purchase history up to date",
        status: "planned",
        screen: "/customers",
        steps: [
          { title: "Find customer", detail: "Search by mobile number or name" },
          { title: "History", detail: "Past bills and total spend" },
          {
            title: "Update credit",
            detail: "Record what changed",
            branches: [
              { title: "Credit sale", detail: "Add a bill to their running balance" },
              { title: "Payment received", detail: "Reduce the balance by cash or UPI" },
            ],
          },
          { title: "Send reminder", detail: "Balance reminder on WhatsApp or SMS" },
        ],
      },
    ],
  },
  {
    title: "Setup",
    description: "Done once, then rarely touched.",
    flows: [
      {
        id: "settings",
        title: "Set up the store",
        actor: "Owner",
        trigger: "First-time setup, or a change in details",
        outcome: "Bills show the right store details and tax",
        status: "planned",
        screen: "/settings",
        steps: [
          { title: "Store details", detail: "Name, address, phone and GSTIN printed on bills" },
          { title: "Tax", detail: "Default GST rates by category" },
          { title: "Receipt", detail: "Header, footer and paper width" },
          { title: "Staff", detail: "Add cashiers and owners, each with a PIN" },
          { title: "Payments", detail: "Store UPI ID for the payment QR; card machine on or off" },
        ],
      },
    ],
  },
];

export const allFlows: Flow[] = flowGroups.flatMap((g) => g.flows);
