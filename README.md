# Smart Student Companion

A responsive React.js student dashboard for managing tasks, study notes, a timetable, and study progress. Built with React, Vite, JavaScript, CSS, and Lucide icons.

## Features

- Dashboard with task statistics and progress
- Add tasks with subject, due date, and priority
- Mark tasks complete, filter tasks, search tasks, and delete tasks
- Create and delete revision notes
- Add classes to a timetable
- Progress dashboard with completion percentage and subject breakdown
- Saves tasks, notes, and timetable entries in browser LocalStorage
- Responsive layout for desktop, tablet, and mobile
- GitHub Pages deployment workflow included

## Run in VS Code

1. Install **Node.js LTS** from https://nodejs.org/.
2. Extract this project ZIP.
3. Open VS Code and choose **File → Open Folder**. Select the `smart-student-companion` folder.
4. Open **Terminal → New Terminal**.
5. Run:

   ```bash
   npm install
   npm run dev
   ```

6. Open the local address shown in the terminal (usually `http://localhost:5173/`). Keep the terminal running while using the site.
7. To test the production build, run `npm run build` and then `npm run preview`.

## Deploy to GitHub Pages

This project includes `.github/workflows/deploy.yml`, so GitHub Actions builds and publishes the site automatically.

1. Sign in to GitHub and create a **new empty public repository** named `smart-student-companion` (do not add a README or `.gitignore` there, because this project already has them).
2. In VS Code, open the project terminal and run these commands one by one:

   ```bash
   git init
   git add .
   git commit -m "Create Smart Student Companion React app"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/smart-student-companion.git
   git push -u origin main
   ```

   Replace `YOUR-USERNAME` with your GitHub username. If Git asks you to identify yourself, configure your Git name and email, then retry the commit.

3. On GitHub, open your repository → **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to **GitHub Actions**.
5. Open the **Actions** tab and wait for “Deploy Smart Student Companion to GitHub Pages” to finish successfully.
6. Your site should be available at:

   `https://YOUR-USERNAME.github.io/smart-student-companion/`

   Replace `YOUR-USERNAME` with your GitHub username. The first deployment can take a few minutes.

## Updating the deployed website

Edit files in VS Code, save them, then run:

```bash
git add .
git commit -m "Update student companion"
git push
```

GitHub Actions will rebuild and redeploy the site after each push to `main`.

## Notes / limitations

- This version is a front-end project; it does not use a server or shared database.
- LocalStorage means saved tasks and notes stay in the same browser on the same device. They are not synced between devices or student accounts.
- The timetable entries are sample data you can replace with your own.
- Google Fonts are loaded online; the app still works if they are unavailable, using fallback fonts.
