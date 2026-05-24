const projectsContent = (
  <>
    <h2>Kevin Wang — Projects</h2>
    <hr />

    <section style={{ marginTop: "1em" }}>
      <h3>Lodestone Server Hosting</h3>
      <p>
        &gt;{" "}
        <a
          href="https://github.com/Lodestone-Team/lodestone"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://github.com/Lodestone-Team/lodestone
        </a>
      </p>
      <p>
        An open-source server hosting platform for Minecraft and other
        multiplayer games, designed to simplify deployment and management for
        both developers and players.
      </p>
      <ul>
        <li>
          Built a modern, component-driven frontend using React, TypeScript,
          Tailwind CSS, and Storybook.
        </li>
        <li>Focused on usability, extensibility, and developer experience.</li>
        <li>
          Maintained a large open-source codebase with 1000+ active users, 800+
          GitHub stars, and 2500+ monthly visitors.
        </li>
        <li>
          Actively improved features, documentation, and long-term
          maintainability.
        </li>
      </ul>
      <p>
        <strong>Tech:</strong> React, TypeScript, Tailwind CSS, Storybook
      </p>
    </section>

    <hr />

    <section style={{ marginTop: "1em" }}>
      <h3>Resume Keyword Analyzer</h3>
      <p>
        &gt;{" "}
        <a
          href="https://github.com/ViridianCitrus/resume-analyzer"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://github.com/ViridianCitrus/resume-analyzer
        </a>
      </p>
      <p>
        A frontend-only web application that analyzes how well a resume matches
        a job description by comparing extracted keywords and generating a
        similarity score.
      </p>
      <ul>
        <li>
          Bootstrapped using Create React App and implemented the entire
          workflow on a single-page interface.
        </li>
        <li>Used react-pdf to extract text from uploaded resumes.</li>
        <li>
          Parsed keywords from resumes and job descriptions using
          keyword-extractor with stop-word filtering.
        </li>
        <li>
          Compared keyword sets using the Jaccard similarity coefficient to
          generate a proportional match score.
        </li>
        <li>Visualized overlapping keywords using a word cloud.</li>
        <li>Styled using Tailwind CSS for rapid development.</li>
      </ul>
      <p>
        <strong>Note:</strong> A backend API would normally handle keyword
        extraction and analysis, but this project intentionally demonstrates a
        pure frontend approach using lightweight libraries.
      </p>
      <p>
        <strong>Tech:</strong> React, JavaScript, Tailwind CSS
      </p>
    </section>

    <hr />

    <section style={{ marginTop: "1em" }}>
      <h3>Climate Change Visualization</h3>
      <p>
        &gt;{" "}
        <a
          href="https://github.com/ViridianCitrus/climate-change-visualization"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://github.com/ViridianCitrus/climate-change-visualization
        </a>
      </p>
      <p>
        An interactive 3D visualization tool that explores the impact of climate
        change across Canada in a simple, user-friendly interface.
      </p>
      <ul>
        <li>
          Built an interactive 3D map allowing users to explore climate data
          spatially.
        </li>
        <li>
          Integrated Government of Canada datasets into a visual, exploratory
          experience.
        </li>
        <li>
          Designed intuitive controls for map manipulation and data exploration.
        </li>
      </ul>
      <p>
        <strong>Tech:</strong>
      </p>
      <ul>
        <li>React + TypeScript</li>
        <li>react-map-gl, deck.gl</li>
        <li>rsuite, react-router-dom</li>
        <li>Data from the Government of Canada</li>
      </ul>
    </section>

    <hr />

    <section style={{ marginTop: "1em" }}>
      <h3>Ocularity</h3>
      <p>
        &gt;{" "}
        <a
          href="https://github.com/kevinzhang03/HTN2022"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://github.com/kevinzhang03/HTN2022
        </a>
      </p>
      <p>
        A web application that tracks user attention using eye-tracking glasses
        to analyze how users view and interact with menu interfaces.
      </p>
      <ul>
        <li>
          Integrated AdHawk eye-tracking hardware to capture real-time gaze
          data.
        </li>
        <li>Visualized attention patterns to evaluate UI usability.</li>
        <li>Built a responsive frontend with modern web tooling.</li>
      </ul>
      <p>
        <strong>Tech:</strong> React, TypeScript, Bootstrap, AdHawk SDK
      </p>
    </section>
  </>
);

export default projectsContent;
