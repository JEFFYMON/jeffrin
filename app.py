import streamlit as st
import streamlit.components.v1 as components
from pathlib import Path

st.set_page_config(
    page_title="Logic Gate Challenge",
    page_icon="🔐",
    layout="wide"
)

base = Path(__file__).parent

html = (base / "index.html").read_text()
css = (base / "style.css").read_text()
js = (base / "app.js").read_text()

html = html.replace(
    '<link rel="stylesheet" href="style.css">',
    f"<style>{css}</style>"
)

html = html.replace(
    '<script src="app.js"></script>',
    f"<script>{js}</script>"
)

components.html(
    html,
    height=1000,
    scrolling=True
)