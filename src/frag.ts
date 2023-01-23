function jsxFragmentPragma(children: (string | string[] | HTMLElement[])[]) {
  try {
    const fragment = document.createDocumentFragment();
    children.forEach((child) => {
      if (typeof child === "string") {
      } else if (child instanceof Array) {
        child.forEach((item) => fragment.appendChild(item as any));
        fragment.appendChild(document.createTextNode(child as any));
      } else {
        fragment.appendChild(child);
      }
    });
    return fragment;
  } catch (error) {
    console.log(error);
  }
}

export { jsxFragmentPragma };
