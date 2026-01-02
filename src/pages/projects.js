const projectsContent = (
  <>
    <div>Kevin Wang — Projects</div>
    <div>──────────────────────────────────────────────</div>

    <br />

    <div>Lodestone Server Hosting</div>
    <div>
      &gt;{" "}
      <a
        href="https://github.com/Lodestone-Team/lodestone"
        target="_blank"
        rel="noopener noreferrer"
      >
        https://github.com/Lodestone-Team/lodestone
      </a>
    </div>

    <br />

    <div>
      An open-source server hosting platform for Minecraft and other multiplayer
      games, designed to simplify deployment and management for both developers
      and players.
    </div>

    <br />

    <div>
      • Built a modern, component-driven frontend using React, TypeScript,
      Tailwind CSS, and Storybook.
    </div>
    <div>• Focused on usability, extensibility, and developer experience.</div>
    <div>
      • Maintained a large open-source codebase with 1000+ active users, 800+
      GitHub stars, and 2500+ monthly visitors.
    </div>
    <div>
      • Actively improved features, documentation, and long-term
      maintainability.
    </div>

    <br />

    <div>Tech: React, TypeScript, Tailwind CSS, Storybook</div>

    <br />
    <br />

    <div>Resume Keyword Analyzer</div>
    <div>
      &gt;{" "}
      <a
        href="https://github.com/ViridianCitrus/resume-analyzer"
        target="_blank"
        rel="noopener noreferrer"
      >
        https://github.com/ViridianCitrus/resume-analyzer
      </a>
    </div>

    <br />

    <div>
      A frontend-only web application that analyzes how well a resume matches a
      job description by comparing extracted keywords and generating a
      similarity score.
    </div>

    <br />

    <div>
      • Bootstrapped using Create React App and implemented the entire workflow
      on a single-page interface.
    </div>
    <div>• Used react-pdf to extract text from uploaded resumes.</div>
    <div>
      • Parsed keywords from resumes and job descriptions using
      keyword-extractor with stop-word filtering.
    </div>
    <div>
      • Compared keyword sets using the Jaccard similarity coefficient to
      generate a proportional match score.
    </div>
    <div>• Visualized overlapping keywords using a word cloud.</div>
    <div>• Styled using Tailwind CSS for rapid development.</div>

    <br />

    <div>Note:</div>
    <div>
      A backend API would normally handle keyword extraction and analysis, but
      this project intentionally demonstrates a pure frontend approach using
      lightweight libraries.
    </div>

    <br />

    <div>Tech: React, JavaScript, Tailwind CSS</div>

    <br />
    <br />

    <div>Climate Change Visualization</div>
    <div>
      &gt;{" "}
      <a
        href="https://github.com/ViridianCitrus/climate-change-visualization"
        target="_blank"
        rel="noopener noreferrer"
      >
        https://github.com/ViridianCitrus/climate-change-visualization
      </a>
    </div>

    <br />

    <div>
      An interactive 3D visualization tool that explores the impact of climate
      change across Canada in a simple, user-friendly interface.
    </div>

    <br />

    <div>
      • Built an interactive 3D map allowing users to explore climate data
      spatially.
    </div>
    <div>
      • Integrated Government of Canada datasets into a visual, exploratory
      experience.
    </div>
    <div>
      • Designed intuitive controls for map manipulation and data exploration.
    </div>

    <br />

    <div>Tech:</div>
    <div>• React + TypeScript</div>
    <div>• react-map-gl, deck.gl</div>
    <div>• rsuite, react-router-dom</div>
    <div>• Data from the Government of Canada</div>

    <br />
    <br />

    <div>Ocularity</div>
    <div>
      &gt;{" "}
      <a
        href="https://github.com/kevinzhang03/HTN2022"
        target="_blank"
        rel="noopener noreferrer"
      >
        https://github.com/kevinzhang03/HTN2022
      </a>
    </div>

    <br />

    <div>
      A web application that tracks user attention using eye-tracking glasses to
      analyze how users view and interact with menu interfaces.
    </div>

    <br />

    <div>
      • Integrated AdHawk eye-tracking hardware to capture real-time gaze data.
    </div>
    <div>• Visualized attention patterns to evaluate UI usability.</div>
    <div>• Built a responsive frontend with modern web tooling.</div>

    <br />

    <div>Tech: React, TypeScript, Bootstrap, AdHawk SDK</div>
  </>
);

export default projectsContent;
