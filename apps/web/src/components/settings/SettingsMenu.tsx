import React, { useState } from 'react';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
}

interface Thesis {
  stage: string;
  check: string;
  verticals: string[];
  criteria: string[];
}

const defaultThesis: Thesis = {
  stage: 'Seed',
  check: '$500k-$2M',
  verticals: ['Data Infrastructure', 'AI/ML Tools', 'Data Analytics', 'DataOps'],
  criteria: [
    'Product-led growth potential',
    'Strong technical founding team',
    'Clear data moat strategy',
    'Initial product in market'
  ]
};

export function SettingsMenu({ isOpen, onClose, anchorRef }: SettingsMenuProps) {
  const [thesis, setThesis] = useState<Thesis>(defaultThesis);
  const [isEditing, setIsEditing] = useState(false);
  const [editedThesis, setEditedThesis] = useState<Thesis>(thesis);
  const [newVertical, setNewVertical] = useState('');
  const [newCriterion, setNewCriterion] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    setThesis(editedThesis);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedThesis(thesis);
    setIsEditing(false);
    setNewVertical('');
    setNewCriterion('');
  };

  const addVertical = () => {
    if (newVertical.trim()) {
      setEditedThesis({
        ...editedThesis,
        verticals: [...editedThesis.verticals, newVertical.trim()]
      });
      setNewVertical('');
    }
  };

  const removeVertical = (index: number) => {
    setEditedThesis({
      ...editedThesis,
      verticals: editedThesis.verticals.filter((_, i) => i !== index)
    });
  };

  const addCriterion = () => {
    if (newCriterion.trim()) {
      setEditedThesis({
        ...editedThesis,
        criteria: [...editedThesis.criteria, newCriterion.trim()]
      });
      setNewCriterion('');
    }
  };

  const removeCriterion = (index: number) => {
    setEditedThesis({
      ...editedThesis,
      criteria: editedThesis.criteria.filter((_, i) => i !== index)
    });
  };

  // Calculate position based on anchor element
  const anchorRect = anchorRef.current?.getBoundingClientRect();
  const topPosition = (anchorRect?.bottom ?? 0) + 8;
  const rightPosition = window.innerWidth - (anchorRect?.right ?? 0);

  return (
    <>
      {/* Backdrop for closing */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Menu */}
      <div
        className="fixed z-50 w-96 rounded-lg border border-gray-200 bg-white shadow-lg"
        style={{
          top: `${topPosition}px`,
          right: `${rightPosition}px`,
        }}
      >
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Investment Thesis</h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-600 hover:bg-gray-200"
              >
                Edit
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Stage</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedThesis.stage}
                  onChange={(e) => setEditedThesis({ ...editedThesis, stage: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-600">{thesis.stage}</p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Check Size</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedThesis.check}
                  onChange={(e) => setEditedThesis({ ...editedThesis, check: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-600">{thesis.check}</p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Target Verticals</label>
              <div className="mt-1 space-y-2">
                {(isEditing ? editedThesis : thesis).verticals.map((vertical, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{vertical}</span>
                    {isEditing && (
                      <button
                        onClick={() => removeVertical(index)}
                        className="text-red-500 hover:text-red-600"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newVertical}
                      onChange={(e) => setNewVertical(e.target.value)}
                      placeholder="Add new vertical"
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                    <button
                      onClick={addVertical}
                      className="rounded-md bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Investment Criteria</label>
              <div className="mt-1 space-y-2">
                {(isEditing ? editedThesis : thesis).criteria.map((criterion, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{criterion}</span>
                    {isEditing && (
                      <button
                        onClick={() => removeCriterion(index)}
                        className="text-red-500 hover:text-red-600"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCriterion}
                      onChange={(e) => setNewCriterion(e.target.value)}
                      placeholder="Add new criterion"
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                    <button
                      onClick={addCriterion}
                      className="rounded-md bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex-1 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className="w-full rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 