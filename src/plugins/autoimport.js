
export const globalComponents = (app) => {
  const componentsGlob = import.meta.glob("../components/global/**/*.vue", {
    eager: true,
  });

  const components = Object.keys(componentsGlob);

  components.forEach((name) => {
    const nameComponent = name.split("/").pop();

    app.component(
      nameComponent.replace(".vue", ""),
      componentsGlob[name].default
    );
  });
};

export default globalComponents;
