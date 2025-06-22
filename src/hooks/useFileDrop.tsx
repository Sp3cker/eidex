import { useMapStore } from "@/stores/useMapStore";
export const useGlobalFileDrop = () => {
  const onDrop = (e: any) => {
    useMapStore.getState().setEncountersData(e);
  };
  //   useEffect(() => {
  //     const handleDragEnter = (e: DragEvent) => {
  //       e.preventDefault();
  //       setIsDragOver(true);
  //     };

  //     const handleDragLeave = (e: DragEvent) => {
  //       e.preventDefault();
  //       // Only set false if leaving the window entirely
  //       if (e.clientX === 0 && e.clientY === 0) {
  //         setIsDragOver(false);
  //       }
  //     };

  //     const handleDragOver = (e: DragEvent) => {
  //       e.preventDefault();
  //     };

  //     const handleDrop = (e: DragEvent) => {
  //       e.preventDefault();
  //       setIsDragOver(false);

  //       const files = e.dataTransfer?.files;
  //       if (files && files.length > 0) {
  //         onFileDrop(files);
  //       }
  //     };

  //     // Attach to window for global drop
  //     window.addEventListener("dragenter", handleDragEnter);
  //     window.addEventListener("dragleave", handleDragLeave);
  //     window.addEventListener("dragover", handleDragOver);
  //     window.addEventListener("drop", handleDrop);

  //     return () => {
  //       window.removeEventListener("dragenter", handleDragEnter);
  //       window.removeEventListener("dragleave", handleDragLeave);
  //       window.removeEventListener("dragover", handleDragOver);
  //       window.removeEventListener("drop", handleDrop);
  //     };
  //   }, [onFileDrop]);

  return { onDrop };
};
