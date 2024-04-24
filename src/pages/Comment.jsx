import React from 'react';

const Comment = ({ isOpen, onClose }) => {
  return (
    <>

      {isOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-50"
          onClick={onClose}
        ></div>
      )}


      {isOpen && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg z-50">
          <h2 className="text-2xl font-bold mb-4">Comment Modal</h2>

          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={onClose}>Close</button>
        </div>
      )}
    </>
  );
}

export default Comment;
