type contentType = "image" | "text";
type textAlign = "left" | "center" | "right";

export interface SelectedElement {
  id: string;
  column: IColumn;
}

export interface IColumn {
  id: string;
  contentType: contentType;
  text: string;
  textAlign: textAlign;
  image: string;
  imageAlt: string;
}

export const defaultColumn: IColumn = {
  id: "",
  contentType: "text",
  text: "",
  textAlign: "left",
  image: "",
  imageAlt: "",
};

export interface IRow {
  id: string;
  columns: IColumn[];
}
