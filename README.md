# Webinar Management Plugin #

Streamline webinar management directly from your WordPress site. This plugin provides a user-friendly interface for creating, managing, and promoting webinars, integrating seamlessly with Gutenberg for a cohesive editing experience.

# Features:

-   **Custom Post Type:** Create and manage webinars as a dedicated post type with comprehensive data fields.
-   **Gutenberg Integration:** Leverage Gutenberg blocks for a user-friendly editing experience:

    -   Title, Subtitle, and Description (restricted to paragraph blocks for clarity and focus).
    -   Date & Time (including calculated duration).
    -   Thumbnail (utilizing featured image functionality).
    -   Registration Form (compatible with both Gravity Forms and Google Forms).
    -   Webinar Link.
    -   Highlights (custom block for managing individual highlights with time and description).
    -   Speakers (custom block for selecting registered users with the "Speaker" role).
    -   Categories (built-in WordPress functionality for organizing webinars).

-   **Custom Taxonomy for Webinar Types:** Create and assign webinar categories like "Stock Market", "Mutual Funds", etc., with desired URL structures achieved through custom rewrite rules.
-   **Custom User Role "Speaker":** Grant specific permissions to users designated as "Speakers" for webinars.
-   **Promotional Block/Pattern:** Design a Gutenberg block or pattern for promoting upcoming webinars within your website, dynamically fetching and displaying the latest information from the corresponding webinar even after modifications.
-   **Landing Page:** Create a dedicated landing page for each webinar using WordPress templating, showcasing details, speaker information, and a user registration form (with confirmation emails).

# Development

## Prerequisites

-   PHP 7.4+
-   MySQL 5.6+
-   Node.js and npm

## Installation

2.  **Clone the repository:**

    Bash

    ```
    git clone https://github.com/dhitimedin/webinar-management-plugin.git

    ```


4.  **Install dependencies:**

    Bash

    ```
    composer install
    npm install

    ```


6.  **Activate the plugin:** Within your WordPress admin panel, navigate to **Plugins** > **Add New** and upload the plugin zip file. Alternatively, search for "Webinar Management" and activate the plugin directly.

## Usage

2.  Create a new **Webinar** post.
4.  Fill in the required details using the provided Gutenberg blocks.
6.  Assign categories and set a speaker (if applicable).
8.  Designate the desired URL structure for webinar types in your WordPress settings.
10.  Create a **Promotional Block** or **Pattern** to promote the webinar within your website.
12.  Visit the created webinar landing page to view details and register for the event.

## Composer
Install composer packages
`composer install`

## Build Tasks (npm)
Everything should be handled by npm.

Install npm packages
`npm install`

| Command              | Action                                                |
|----------------------|-------------------------------------------------------|
| `npm run watch`      | Compiles and watch for changes.                       |
| `npm run compile`    | Compile production ready assets.                      |
| `npm run build`  | Build production ready bundle inside `/build/` folder |


# Contributing

We welcome contributions to this project! Please see the `CONTRIBUTING.md` file for guidelines.

# License

This plugin is licensed under the MIT License. See the `LICENSE` file for details.

# Additional Notes:

-   Consider using a plugin like "CMB2" to simplify custom meta box creation.
-   Implement proper validation and sanitization for user input.
-   Employ security measures to protect sensitive data like registration information.
-   Design custom CSS styles to achieve the desired UI for different elements.