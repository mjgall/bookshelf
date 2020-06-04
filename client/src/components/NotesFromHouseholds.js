import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InlineEdit from '@atlaskit/inline-edit';
import TextArea from '@atlaskit/textarea';

const NotesFromHouseholds = (props) => {
  const [loaded, setLoaded] = useState(false);
  const [householdNotes, setHouseholdNotes] = useState([]);

  const fetchHouseholdNotes = async (bookId) => {
    const householdNotes = await axios
      .get(`/api/notes/households/${bookId}`)
      .then((response) => response.data);
    setHouseholdNotes(householdNotes);
    setLoaded(true);
  };

  useEffect(() => {
    fetchHouseholdNotes(props.bookId);
  }, [props.bookId]);

  const handleHouseholdNotesChange = async (
    globalBookId,
    householdId,
    value,
    index
  ) => {
    console.log(globalBookId, householdId, value);
    axios
      .post(`/api/households/books`, {
        field: 'notes',
        value,
        globalBookId,
        householdId,
      })
      .then((response) => response.data);
    const updatedHouseholdNotes = [...householdNotes];
    updatedHouseholdNotes[index].notes = value;

    setHouseholdNotes(updatedHouseholdNotes);
  };

  return (
    <>
      {loaded ? (
        <div>
          {householdNotes.map((householdNote, index) => {
            return (
              <InlineEdit
              
                key={index}
                keepEditViewOpenOnBlur={true}
                defaultValue={householdNote.notes}
                label={`Notes from ${householdNote.household_name}`}
                editView={(fieldProps, ref) => (
                  <TextArea {...fieldProps} ref={ref} value={householdNote.notes}></TextArea>
                )}
                readView={() => {
                  if (householdNote.notes) {
                    return (
                      <div className='multiline'>{householdNote.notes}</div>
                    );
                  } else {
                    return (
                      <div className='text-gray-500'>
                        No notes yet - click to add some!
                      </div>
                    );
                  }
                }}
                onConfirm={(value) =>
                  handleHouseholdNotesChange(
                    props.bookId,
                    householdNote.household_id,
                    value,
                    index
                  )
                }
                autoFocus
                readViewFitContainerWidth
              />
            );
          })}
        </div>
      ) : null}
    </>
  );
};

export default NotesFromHouseholds;