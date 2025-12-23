import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import SideBar from "../../components/SideBar";

import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const MyWorkSpace = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  useEffect(() => {
    const savedContent = localStorage.getItem("myNoteDraft");
    if (savedContent) {
      const content = convertFromRaw(JSON.parse(savedContent));
      setEditorState(EditorState.createWithContent(content));
    }
  }, []);

  const handleEditorChange = (state) => {
    setEditorState(state);
    const content = state.getCurrentContent();
    localStorage.setItem("myNoteDraft", JSON.stringify(convertToRaw(content)));
  };
  useEffect(() => {
  const interval = setInterval(() => {
    setEditorState(EditorState.createEmpty());
    localStorage.removeItem("myNoteDraft");
  }, 190000);  
  return () => clearInterval(interval);
}, []);
  return (
    <Layout>
      <main class="crm_all_body d-flex">
        <SideBar />
        <div className="crm_right relative">
          <div className="header_crm flex_props justify-content-between">
            <p className="crm_title mb_3">Online WorkSheet</p>
          </div>
          <div className="editor_workspace">
            <Editor
              editorState={editorState}
              onEditorStateChange={handleEditorChange}
              wrapperClassName="demo-wrapper"
              editorClassName="demo-editor"
              toolbar={{
                options: [
                  "inline",
                  "blockType",
                  "fontSize",
                  "fontFamily",
                  "list",
                  "textAlign",
                  "colorPicker",
                  "link",
                  "embedded",
                  "emoji",
                  "remove",
                  "history",
                ],
                inline: { inDropdown: false },
                list: { inDropdown: false },
                textAlign: { inDropdown: false },
                link: { inDropdown: false },
              }}
            />
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default MyWorkSpace;
