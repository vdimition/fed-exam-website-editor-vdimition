import { FC, useState } from "react";

import { v4 as uuidv4 } from 'uuid';

import { Column } from "../column";
import { Icons } from "../icons";
import { ImagePlaceholder } from "../image-placeholder";
import { Markdown } from "../markdown";
import { Row } from "../row";
import { Stage } from "../stage";


type contentType = "image" | "text"
type textAlign = 'left' | 'center' | 'right'

interface Column {
  id: string,
  contentType: contentType
  text: string,
  textAlign: textAlign
  image: string,
  imageAlt: string,
}

export const defaultColumn: Column = {
  id: '',
  contentType: "text",
  text: '',
  textAlign: "left",
  image: '',
  imageAlt: '',
}

interface Selected {
  id: string,
  column: Column
}

interface Row {
  id: string,
  columns: Column[]
}

interface State {
  rows: Row[];
}

export const Editor: FC = () => {
  const [selected, setSelected] = useState<Selected>({ id: '', column: defaultColumn });
  const [state, setState] = useState<State>({ rows: [] });

  const handleSelect = (selected: { id: string, column?: Column }) => () => {
    setSelected({ ...selected, column: selected.column || defaultColumn });
  };

  const handleRowAdd = () => {
    const newRowId = uuidv4();
    setState({ ...state, rows: [...state.rows, { id: newRowId, columns: [] }] });
    setSelected({ id: newRowId, column: defaultColumn })
  }

  const handleColumnAdd = () => {
    const column: Column = { ...defaultColumn, id: uuidv4() }

    setState({
      ...state, rows: state.rows.map((row): Row => {
        if (row.id === selected.id) {
          return { ...row, columns: [...row.columns, column] };
        }

        return row;
      })
    });
    setSelected({...selected, column})
  };

  const handleColumnChange = (newColumn: Column) => {
    const updatedRows = state.rows.map(row => {
      if (row.id === selected.id) {
        return {
          ...row,
          columns: row.columns.map(column => {
            if (column.id === selected.column?.id) {
              return newColumn;
            }

            return column;
          })
        };
      }

      return row;
    });

    setState({ ...state, rows: updatedRows });
    setSelected({ ...selected, column: newColumn })
  }

  return (
    <div className="editor">
      <Stage>
        {state.rows.map(({ id, columns }) => (
          <Row
            key={id}
            onSelect={handleSelect({ id: id })}
            selected={!selected.column.id && selected.id === id}
          >
            {columns.map((column) => (
              <Column
                key={column.id}
                onSelect={handleSelect({ id: id, column })}
                selected={selected.column?.id === column.id}
              >
                {column.contentType === "text" && (
                  <Markdown className={`text-align-${column.textAlign}`}>{column.text}</Markdown>
                )}
                {column.contentType === "image" && (
                  column.image ? (
                    <img src={column.image} alt={column.imageAlt} />
                  ) : (
                    <ImagePlaceholder />
                  )
                )}
              </Column>
            ))}

          </Row>
        ))}
      </Stage>

      <div className="properties">
        <div className="section">
          <div className="section-header">Page</div>
          <div className="actions">
            <button onClick={handleRowAdd} className="action">Add row</button>
          </div>
        </div>

        {selected.id ? (
          <>
            <div className="section">
              <div className="section-header">Row</div>
              <div className="actions">
                <button onClick={handleColumnAdd} className="action">Add column</button>
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
                        onClick={() => handleColumnChange({...selected.column, contentType: "text"})}
                        className={selected.column.contentType === 'text' ? 'selected' : ''}
                      >
                        <Icons.Text />
                      </button>
                      <button
                        onClick={() => handleColumnChange({...selected.column, contentType: "image"})}
                        className={selected.column.contentType === 'image' ? 'selected' : ''}
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
                        <button onClick={() => handleColumnChange({...selected.column, textAlign: 'left' })} className={selected.column.textAlign === 'left' ? 'selected' : ''}>
                          <Icons.TextAlignLeft />
                        </button>
                        <button onClick={() => handleColumnChange({...selected.column, textAlign: 'center' })} className={selected.column.textAlign === 'center' ? 'selected' : ''}>
                          <Icons.TextAlignCenter />
                        </button>
                        <button onClick={() => handleColumnChange({...selected.column, textAlign: 'right' })} className={selected.column.textAlign === 'right' ? 'selected' : ''}>
                          <Icons.TextAlignRight />
                        </button>
                      </div>
                    </div>
                    <div className="textarea-field">
                      <textarea
                        rows={8} placeholder="Enter text"
                        value={selected.column.text}
                        onChange={(e) => handleColumnChange({...selected.column, text: e.target.value})}
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
                        id="image-url" type="text" value={selected.column.image}
                        onChange={(e) => handleColumnChange({...selected.column, image: e.target.value})}
                      />
                    </div>
                    <div className="text-field">
                      <label htmlFor="image-url">Alt</label>
                      <input
                        id="image-alt" type="text" value={selected.column.imageAlt}
                        onChange={(e) => handleColumnChange({...selected.column, imageAlt: e.target.value})}
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
