# Ulap Tayo - An Open-Source Weather Forecast Web App

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Powered by: Open-Meteo](https://img.shields.io/badge/Powered%20by-Open--Meteo-orange.svg)](https://open-meteo.com/)
[![Built with: React](https://img.shields.io/badge/Built%20with-React-61DAFB.svg)](https://react.dev/)
[![Styled with: Tailwind](https://img.shields.io/badge/Styled%20with-Tailwind-38B2AC.svg)](https://tailwindcss.com/)

A feature-rich, interactive weather forecast website built with React, Vite, Leaflet maps, and styled with Tailwind CSS and Shadcn/ui.

**[➡️ View the Live Demo](https://ulap-tayo.vercel.app/)**

### 🖼️ Preview

![Ulap Tayo Demo](https://github.com/hanzfabellon/ulap-tayo/blob/main/demo.gif?raw=true)

### ✅ Features

*   **Current Weather:** Real-time temperature, conditions, "feels like," humidity, wind speed, and more.
*   **24-Hour Forecast:** Detailed hourly breakdown of temperature and precipitation probability.
*   **7-Day Extended Forecast:** Plan your week with daily high/low temperatures and weather conditions.
*   **Interactive Map:** Click anywhere on the map to instantly get the weather for that location, powered by Leaflet and OpenStreetMap.
*   **Reverse Geocoding:** Automatically fetches and displays the name of the selected location.
*   **Responsive Design:** Looks great on both desktop and mobile devices.

### 🛠️ Tech Stack

*   **Framework:** React with Vite
*   **Weather Data:** [Open-Meteo API](https://open-meteo.com/) (Free, no API key required)
*   **Mapping:** [Leaflet.js](https://leafletjs.com/) with OpenStreetMap tiles
*   **Geocoding:** [LocationIQ API](https://locationiq.com/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [Shadcn/ui](https://ui.shadcn.com/)
*   **Icons:** [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed and configured:

*   **Node.js**: `v18` or newer
*   **pnpm**: Package manager
*   **LocationIQ Account**: A free account created on the [LocationIQ Website](https://locationiq.com/) to get an API key for reverse geocoding.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/hanzfabellon/ulap-tayo.git
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd ulap-tayo
    ```

3.  **Install the dependencies:**
    ```bash
    pnpm install
    ```

4.  **Set up your environment variables:**
    *   Create a new file in the root of the project named `.env.local`.
    *   Copy the contents of the example below into your new file.
    *   Log in to your [LocationIQ Dashboard](https://my.locationiq.com/dashboard/login), go to the "API Access Tokens" section, and replace the placeholder value with your **actual** Access Token.

    ```ini:.env.local
    # ⚠️ IMPORTANT: Replace this with your own LocationIQ Access Token!
    #
    # Get this from your LocationIQ Dashboard:
    # https://my.locationiq.com/dashboard/
    #
    VITE_LOCATIONIQ_KEY="pk.your-secret-locationiq-api-key"
    ```

5.  **Run the development server:**
    ```bash
    pnpm run dev
    ```

Your application should now be running on `http://localhost:5173`.

> #### ⚠️ How Your LocationIQ API Key Stays Secure
>
> Your LocationIQ key is a secret and should **never** be committed to your repository. The `.gitignore` file is already configured to ignore `.env.local`.
>
> To add an extra layer of security for your deployed application, you should restrict your API key in the LocationIQ dashboard:
>
> 1.  Go to your [LocationIQ Dashboard](https://my.locationiq.com/dashboard/).
> 2.  Find your Access Token and click "Show Advanced Options".
> 3.  Under "Allowed HTTP Referers," add the domain of your deployed site (e.g., `ulap-tayo.vercel.app`).
>
> This ensures your key can only be used on requests coming from your own website.

---

### 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.
