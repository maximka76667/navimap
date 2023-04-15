import { IBusStop, IRoute } from "./interfaces";

export const busStops1: IBusStop[] = [
  {
    name: "Hospital Clínico",
    location: [42.86927493580471, -8.565194059673908],
  },
  {
    name: "Rúa da Choupana, 11",
    location: [42.86853410566873, -8.560814370894743],
  },
  {
    name: "Santa maria",
    location: [42.870665302624445, -8.557767606209506],
  },
  {
    name: "ave rosalia 131",
    location: [42.871838663214824, -8.555693076158187],
  },
  {
    name: "avda rosalia 87",
    location: [42.87341293411154, -8.552961940162687],
  },
  {
    name: "",
    location: [42.87642081723467, -8.547783614106944],
  },
  {
    name: "",
    location: [42.87681493801203, -8.545473864570742],
  },
  {
    name: "",
    location: [42.87881877179705, -8.541158759587265],
  },
  {
    name: "",
    location: [42.88065357713955, -8.540313173081632],
  },
  {
    name: "",
    location: [42.883908345623176, -8.541313944246403],
  },
  {
    name: "Basqunos, 28",
    location: [42.886963333173135, -8.539540874927793], // Basqunos, 28
  },
  {
    name: "",
    location: [42.888153239664724, -8.537326444246276],
  },
  {
    name: "",
    location: [42.889697081010816, -8.535336661433309],
  },
  {
    name: "",
    location: [42.89383638172064, -8.531957459586877],
  },
  {
    name: "",
    location: [42.89588813699176, -8.530387801916483],
  },
  {
    name: "",
    location: [42.89757603348599, -8.528809019689946], // P
  },
  {
    name: "",
    location: [42.905935175545025, -8.514548953659748], // Q
  },
  {
    name: "",
    location: [42.907692463621224, -8.516018003494624], // R
  },
];

export const route1: IRoute = {
  name: "Hospital Clinico - Cementerio Boisaca",
  route: busStops1,
};

export const GOOGLE_MAPS_LIBRARIES = ["places" as const];

export const WALKING_DIRECTIONS_RENDERER_OPTIONS = {
  suppressMarkers: true,
};
