import streamlit as st
import streamlit.components.v1 as components
from pathlib import Path


# ========================================
# STREAMLIT PAGE CONFIGURATION
# ========================================

st.set_page_config(
    page_title="Logic Gate Challenge",
    page_icon="🔐",
    layout="wide",
    initial_sidebar_state="collapsed",
)


# ========================================
# PROJECT FILES
# ========================================

BASE_DIR = Path(__file__).resolve().parent

INDEX_FILE = BASE_DIR / "index.html"
CSS_FILE = BASE_DIR / "style.css"
JS_FILE = BASE_DIR / "app.js"


# ========================================
# CHECK REQUIRED FILES
# ========================================

missing_files = []

if not INDEX_FILE.exists():
    missing_files.append("index.html")

if not CSS_FILE.exists():
    missing_files.append("style.css")

if not JS_FILE.exists():
    missing_files.append("app.js")


if missing_files:
    st.error(
        "The following required project files are missing: "
        + ", ".join(missing_files)
    )
    st.stop()


# ========================================
# READ PROJECT FILES
# ========================================

try:
    html = INDEX_FILE.read_text(encoding="utf-8")
    css = CSS_FILE.read_text(encoding="utf-8")
    javascript = JS_FILE.read_text(encoding="utf-8")

except Exception as error:
    st.error("Could not read the project files.")
    st.code(str(error))
    st.stop()


# ========================================
# BUILD COMPLETE HTML DOCUMENT
# ========================================

full_html = f"""
<!DOCTYPE html>

<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width,
                 initial-scale=1.0"
    >

    <title>Logic Gate Challenge</title>

    <style>

        /* ====================================
           STREAMLIT EMBED RESET
        ==================================== */

        html,
        body {{
            margin: 0;
            padding: 0;
            width: 100%;
            min-height: 100%;
            background: #050812;
        }}

        body {{
            overflow-x: hidden;
        }}

        /* ====================================
           ORIGINAL PROJECT CSS
        ==================================== */

        {css}

    </style>

</head>


<body>

    <!-- ====================================
         ORIGINAL PROJECT HTML
    ==================================== -->

    {html}


    <!-- ====================================
         ORIGINAL PROJECT JAVASCRIPT
    ==================================== -->

    <script>

        {javascript}

    </script>

</body>

</html>
"""


# ========================================
# DISPLAY APPLICATION
# ========================================

components.html(
    full_html,
    height=1500,
    scrolling=True,
)