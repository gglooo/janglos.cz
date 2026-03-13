import { ContentType } from "../types/ContentType";
import { IconType } from "../types/IconType";

import GlobeIcon from "../assets/globe.png";
import ProjectsIcon from "../assets/projects.png";
import WeatherIcon from "../assets/weather.png";
import GitHubIcon from "../assets/github.png";
import LinkedInIcon from "../assets/linkedin.png";

export interface DesktopIconConfig {
    icon: string;
    name: ContentType;
    type?: IconType;
    onClick?: VoidFunction;
    hidden?: boolean;
}

export const desktopIcons: DesktopIconConfig[] = [
    {
        icon: GlobeIcon,
        name: "About\u00A0me",
    },
    {
        icon: ProjectsIcon,
        name: "Projects",
    },
    {
        icon: WeatherIcon,
        name: "Weather",
    },
    {
        icon: GitHubIcon,
        name: "GitHub",
        type: "link",
        onClick: () => window.open("https://github.com/gglooo"),
        hidden: true,
    },
    {
        icon: LinkedInIcon,
        name: "LinkedIn",
        type: "link",
        onClick: () =>
            window.open("https://www.linkedin.com/in/jan-glos-21007b202/"),
        hidden: true,
    },
];
