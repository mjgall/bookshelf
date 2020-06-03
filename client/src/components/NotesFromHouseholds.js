import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Context } from '../globalContext';
import InlineEdit from '@atlaskit/inline-edit';
import TextArea from '@atlaskit/textarea';
import Textfield from '@atlaskit/textfield';

const NotesFromHouseholds = (props) => {
  const global = useContext(Context);

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
  }, []);

  const handleHouseholdNotesChange = (id, value) => {
    
  }

  return (
    <>
      {loaded ? (
        <div>
          {householdNotes.map((householdNote) => {
            return (
              <InlineEdit
                keepEditViewOpenOnBlur={true}
                defaultValue={householdNotes.notes}
                label={`Notes from ${householdNote.household_name}`}
                editView={(fieldProps, ref) => (
                  <TextArea {...fieldProps} ref={ref}></TextArea>
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
                  handleHouseholdNotesChange(householdNote.id, value)
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
