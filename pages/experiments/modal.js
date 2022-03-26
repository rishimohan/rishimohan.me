import {useState} from "react";

export default function Modal() {
  const [modal, setModal] = useState(false);

  const RenderModal = () => {
    const dummy = [
      {title: "General"},
      {title: "Display"},
      {title: "Content"},
      {title: "Profile"},
      {title: "Subscription"},
      {title: "Shortcuts"},
    ];

    return (
      <div className="fixed inset-0 z-10 w-full h-full flex items-center justify-center">
        <div
          className="backdrop absolute inset-0 w-full h-full "
          onClick={() => setModal(false)}
        />
        <div className="border border-gray-800 min-w-[500px] rounded-xl relative z-10 bg-gray-900 shadow-lg">
          <div className="py-2 border-b border-gray-800/50 px-5 flex items-center justify-between">
            <div>Preferences</div>
            <div
              className="text-gray-600 text-sm hover:text-gray-500 cursor-pointer"
              onClick={() => setModal(false)}
            >
              Close
            </div>
          </div>
          <div className="px-5 py-2 grid grid-cols-3">
            {dummy?.map((item) => (
              <div
                className="text-gray-400 text-sm text-center w-full aspect-square flex items-start justify-center"
                key={item.title}
              >
                {item.title}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex bg-gray-900 p-10 items-center justify-center">
        <button onClick={() => setModal(true)} className="border px-4 py-2 border-gray-800 bg-gray-800/50 hover:border-gray-700 rounded-lg text-gray-300 shadow">Open modal</button>
      </div>
      {modal ? <RenderModal /> : ""}
    </>
  )
}