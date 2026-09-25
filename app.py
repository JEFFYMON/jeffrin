import streamlit as st
import streamlit.components.v1 as components
from pathlib import Path

st.set_page_config(
    page_title="Logic Gate Challenge",
    page_icon="🔐",
    layout="wide"
)

base = Path(__file__).parent

# Read project files
html = (base / "index.html").read_text(encoding="utf-8")
css = (base / "style.css").read_text(encoding="utf-8")
js = (base / "app.js").read_text(encoding="utf-8")

# Build a complete HTML document
full_html = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <style>
        {css}
    </style>
</head>

<body>

    {html}

    <script>
        {js}
    </script>

</body>
</html>
"""

components.html(
    full_html,
    height=1400,
    scrolling=True
)