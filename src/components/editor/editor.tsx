import { FC, useState } from "react";

import { Column } from "../column";
import { Icons } from "../icons";
import { ImagePlaceholder } from "../image-placeholder";
import { Markdown } from "../markdown";
import { Row } from "../row";
import { Stage } from "../stage";
import {
  createNewColumn,
  createNewRow,
  updateRowsWithAddedColumn,
  updateRowsWithAddedRow,
  updateRowsWithUpdatedColumn,
} from "../../utility";
import { defaultColumn, IColumn, IRow, SelectedElement } from "../../types";

export const Editor: FC = () => {
  const [selected, setSelected] = useState<SelectedElement>({ id: "", column: defaultColumn });
  const [rows, setRows] = useState<IRow[]>([]);

  const handleSelect = (selected: { id: string; column?: IColumn }) => () => {
    setSelected({ ...selected, column: selected.column || defaultColumn });
  };

  const handleRowAdd = () => {
    const newRow: IRow = createNewRow();
    const newRows: IRow[] = updateRowsWithAddedRow(rows, newRow, selected.id);

    setRows(newRows);
    setSelected({ id: newRow.id, column: defaultColumn });
  };

  const handleColumnAdd = () => {
    const newColumn: IColumn = createNewColumn();
    const newRows: IRow[] = updateRowsWithAddedColumn(rows, newColumn, selected.id, selected.column.id);

    setRows(newRows);
    setSelected({ ...selected, column: newColumn });
  };

  const handleColumnChange = (newColumn: IColumn) => {
    const updatedRows: IRow[] = updateRowsWithUpdatedColumn(rows, newColumn, selected.id);

    setRows(updatedRows);
    setSelected({ ...selected, column: newColumn });
  };

  return (
    <div className="editor">
      <Stage>
        {rows.map(({ id, columns }: IRow) => (
          <Row key={id} onSelect={handleSelect({ id: id })} selected={!selected.column.id && selected.id === id}>
            {columns.map((column: IColumn) => (
              <Column
                key={column.id}
                onSelect={handleSelect({ id: id, column })}
                selected={selected.column?.id === column.id}
              >
                {column.contentType === "text" && (
                  <Markdown className={`text-align-${column.textAlign}`}>{column.text}</Markdown>
                )}
                {column.contentType === "image" &&
                  (column.image ? <img src={column.image} alt={column.imageAlt} /> : <ImagePlaceholder />)}
              </Column>
            ))}
          </Row>
        ))}
      </Stage>

      <div className="properties">
        <div className="section">
          <div className="section-header">Page</div>
          <div className="actions">
            <button onClick={handleRowAdd} className="action">
              Add row
            </button>
          </div>
        </div>

        {selected.id ? (
          <>
            <div className="section">
              <div className="section-header">Row</div>
              <div className="actions">
                <button onClick={handleColumnAdd} className="action">
                  Add column
                </button>
              </div>
            </div>

            {selected.column?.id ? (
              <>
                <div className="section">
                  <div className="section-header">Column</div>
                  <div className="button-group-field">
                    <label>Contents</label>
                    <div className="button-group">
                      <button
                        onClick={() => handleColumnChange({ ...selected.column, contentType: "text" })}
                        className={selected.column.contentType === "text" ? "selected" : ""}
                      >
                        <Icons.Text />
                      </button>
                      <button
                        onClick={() => handleColumnChange({ ...selected.column, contentType: "image" })}
                        className={selected.column.contentType === "image" ? "selected" : ""}
                      >
                        <Icons.Image />
                      </button>
                    </div>
                  </div>
                </div>

                {selected.column.contentType === "text" && (
                  <div className="section">
                    <div className="section-header">Text</div>
                    <div className="button-group-field">
                      <label>Alignment</label>
                      <div className="button-group">
                        <button
                          onClick={() => handleColumnChange({ ...selected.column, textAlign: "left" })}
                          className={selected.column.textAlign === "left" ? "selected" : ""}
                        >
                          <Icons.TextAlignLeft />
                        </button>
                        <button
                          onClick={() => handleColumnChange({ ...selected.column, textAlign: "center" })}
                          className={selected.column.textAlign === "center" ? "selected" : ""}
                        >
                          <Icons.TextAlignCenter />
                        </button>
                        <button
                          onClick={() => handleColumnChange({ ...selected.column, textAlign: "right" })}
                          className={selected.column.textAlign === "right" ? "selected" : ""}
                        >
                          <Icons.TextAlignRight />
                        </button>
                      </div>
                    </div>
                    <div className="textarea-field">
                      <textarea
                        rows={8}
                        placeholder="Enter text"
                        value={selected.column.text}
                        onChange={(e) => handleColumnChange({ ...selected.column, text: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {selected.column.contentType === "image" && (
                  <div className="section">
                    <div className="section-header">Image</div>
                    <div className="text-field">
                      <label htmlFor="image-url">URL</label>
                      <input
                        id="image-url"
                        type="text"
                        value={selected.column.image}
                        onChange={(e) => handleColumnChange({ ...selected.column, image: e.target.value })}
                      />
                    </div>
                    <div className="text-field">
                      <label htmlFor="image-url">Alt</label>
                      <input
                        id="image-alt"
                        type="text"
                        value={selected.column.imageAlt}
                        onChange={(e) => handleColumnChange({ ...selected.column, imageAlt: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
};
