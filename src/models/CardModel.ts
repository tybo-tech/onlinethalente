export interface CardModel {
  title: string;
  description?: string;
  image?: string;

  actionLabel?: string;      // e.g., "Add to Cart", "Edit"
  dangerLabel?: string;      // e.g., "Delete"
  showDanger?: boolean;      // toggle second button
  icon?: string;             // optional icon for main button

  rounded?: boolean;
  border?: boolean;
}
