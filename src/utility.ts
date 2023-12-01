import { v4 as uuidv4 } from "uuid";
import { defaultColumn, IColumn, IRow } from "./types";

export const createNewRow = (): IRow => ({ id: uuidv4(), columns: [] });

export const createNewColumn = (): IColumn => ({ ...defaultColumn, id: uuidv4() });

export const updateRowsWithAddedRow = (rows: IRow[], newRow: IRow, selectedRowId: string): IRow[] => {
  if (rows.length) {
    return rows.reduce((acc: IRow[], row: IRow): IRow[] => {
      if (row.id === selectedRowId) {
        return [...acc, row, newRow];
      }

      return [...acc, row];
    }, []);
  }

  return [newRow];
};

export const updateRowsWithAddedColumn = (
  rows: IRow[],
  newColumn: IColumn,
  selectedRowId: string,
  selectedColumnId: string
) => {
  return rows.map((row: IRow): IRow => {
    if (row.id === selectedRowId) {
      let newColumns: IColumn[] = [newColumn];

      if (row.columns.length) {
        newColumns = row.columns.reduce((acc: IColumn[], column: IColumn) => {
          if (column.id === selectedColumnId) {
            return [...acc, column, newColumn];
          }

          return [...acc, column];
        }, []);
      }

      return { ...row, columns: newColumns };
    }

    return row;
  });
};

export const updateRowsWithUpdatedColumn = (rows: IRow[], newColumn: IColumn, selectedRowId: string) => {
  return rows.map((row: IRow): IRow => {
    if (row.id === selectedRowId) {
      return {
        ...row,
        columns: row.columns.map((column: IColumn): IColumn => {
          if (column.id === newColumn.id) {
            return newColumn;
          }

          return column;
        }),
      };
    }

    return row;
  });
};
