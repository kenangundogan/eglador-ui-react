export const toggleTheme = (attr: string = "data-theme") => {
  const html = document.documentElement;

  if (html.getAttribute(attr) === "dark") {
    html.setAttribute(attr, "light");
  } else {
    html.setAttribute(attr, "dark");
  }
};

export const setTheme = (theme: "dark" | "light", attr: string = "data-theme") => {
  document.documentElement.setAttribute(attr, theme);
};