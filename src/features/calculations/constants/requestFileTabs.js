// Folders of a request's files on the Request Detail page, in tab order.
// `key` is where the files are stored on the request (request.files[key]),
// so keep it stable when renaming a tab.
export const REQUEST_FILE_TABS = [
  {
    key: "brief",
    label: "Brief & References",
    hint: "The cover and the reference material that came with the request.",
  },
  {
    key: "calculation",
    label: "Calculation",
    hint: "Calculation sheets and their supporting files.",
  },
  {
    key: "drawing",
    label: "Drawing",
    hint: "Drawings and CAD data.",
  },
  {
    key: "files",
    label: "Files",
    hint: "Any other file of this request.",
  },
  {
    key: "notes",
    label: "Notes History",
    hint: "Notes and correspondence about the request, e.g. revision requests.",
  },
  {
    key: "output",
    label: "Output Package",
    hint: "The final documents delivered for this request.",
  },
];
