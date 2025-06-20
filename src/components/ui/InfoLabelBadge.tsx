const InfoLabelBadge = ({ text }: { text: string }) => (
  <div className="w-19 font-calamity absolute left-6 top-0 flex translate-y-[-50%] select-none items-center justify-center rounded border border-gray-300 bg-gray-800 px-4 py-1 text-center text-xs font-bold text-neutral-100">
    {text}
  </div>
);

export default InfoLabelBadge;
