import React, { useEffect, useState } from "react";
import "./TestManager.css";

/*
  Single-file small LMS app with User and Admin pages.
  Usage:
   - Save as src/App.jsx
   - Save CSS as src/App.css (below)
   - Import and render <App /> in index.js
*/

const LS_TESTS = "lms_tests_v1";
const LS_TAGS = "lms_tags_v1";

export default function TestManager() {
  const [route, setRoute] = useState("user"); // 'user' or 'admin'
  const [tags, setTags] = useState([]);
  const [tests, setTests] = useState([]);

  // UI states
  const [filterTag, setFilterTag] = useState("all");
  const [search, setSearch] = useState("");
  const [showTestModal, setShowTestModal] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [showTagManager, setShowTagManager] = useState(false);
  const [copyModal, setCopyModal] = useState({ open: false, test: null });
  const [viewModal, setViewModal] = useState({ open: false, test: null, shown: 4 });

  useEffect(() => {
    const rawTags = localStorage.getItem(LS_TAGS);
    const rawTests = localStorage.getItem(LS_TESTS);
    if (rawTags) setTags(JSON.parse(rawTags));
    else {
      const defaultTags = [
        { id: "all", name: "All" },
        { id: "general", name: "General" },
        { id: "aptitude", name: "Aptitude" },
      ];
      setTags(defaultTags);
      localStorage.setItem(LS_TAGS, JSON.stringify(defaultTags));
    }
    if (rawTests) setTests(JSON.parse(rawTests));
    else {
      const s = [
        sampleTest("Sample Test 1", ["general"], 10),
        sampleTest("Aptitude Check", ["aptitude"], 6),
      ];
      setTests(s);
      localStorage.setItem(LS_TESTS, JSON.stringify(s));
    }
  }, []);

  // helpers
  function makeId() {
    return (Date.now() + Math.floor(Math.random() * 9999)).toString();
  }
  function sampleTest(name, tagsArr, qCount) {
    return {
      id: makeId(),
      name,
      tags: tagsArr,
      questions: Array.from({ length: qCount }).map((_, i) => ({ id: makeId(), text: `Question ${i + 1}: sample text` })),
      lastModified: new Date().toISOString(),
    };
  }
  function persistTags(newTags) {
    setTags(newTags);
    localStorage.setItem(LS_TAGS, JSON.stringify(newTags));
  }
  function persistTests(newTests) {
    setTests(newTests);
    localStorage.setItem(LS_TESTS, JSON.stringify(newTests));
  }

  // Tag operations
  function createTag(name) {
    if (!name?.trim()) return;
    const id = makeId();
    const newTags = [...tags, { id, name: name.trim() }];
    persistTags(newTags);
  }
  function editTag(id, name) {
    const newTags = tags.map((t) => (t.id === id ? { ...t, name } : t));
    persistTags(newTags);
  }
  function deleteTag(id) {
    const newTags = tags.filter((t) => t.id !== id);
    const newTests = tests.map((ts) => ({ ...ts, tags: ts.tags.filter((x) => x !== id) }));
    persistTags(newTags);
    persistTests(newTests);
  }

  // Test operations
  function openCreateTest() {
    setEditingTest({ id: null, name: "", tags: [], questions: [] });
    setShowTestModal(true);
  }
  function saveTest(data) {
    if (!data.name?.trim()) {
      alert("Name required");
      return;
    }
    if (data.id) {
      const updated = tests.map((t) => (t.id === data.id ? { ...t, ...data, lastModified: new Date().toISOString() } : t));
      persistTests(updated);
    } else {
      const created = { ...data, id: makeId(), lastModified: new Date().toISOString() };
      persistTests([created, ...tests]);
    }
    setShowTestModal(false);
    setEditingTest(null);
  }
  function triggerEditTest(id) {
    const t = tests.find((x) => x.id === id);
    if (!t) return;
    setEditingTest(JSON.parse(JSON.stringify(t)));
    setShowTestModal(true);
  }
  function deleteTest(id) {
    if (!window.confirm("Confirm delete?")) return;
    const newT = tests.filter((t) => t.id !== id);
    persistTests(newT);
  }
  function triggerCopy(id) {
    const t = tests.find((x) => x.id === id);
    if (!t) return;
    setCopyModal({ open: true, test: { ...t } });
  }
  function confirmCopy(newName) {
    const base = copyModal.test;
    const copy = {
      ...base,
      id: makeId(),
      name: newName || `${base.name} (copy)`,
      lastModified: new Date().toISOString(),
      questions: base.questions.map((q) => ({ ...q, id: makeId() })),
    };
    persistTests([copy, ...tests]);
    setCopyModal({ open: false, test: null });
  }

  // View full test
  function openView(id) {
    const t = tests.find((x) => x.id === id);
    if (!t) return;
    setViewModal({ open: true, test: t, shown: 4 });
  }
  function loadMore() {
    setViewModal((v) => ({ ...v, shown: v.shown + 4 }));
  }

  const displayed = tests
    .filter((t) => (filterTag === "all" ? true : t.tags.includes(filterTag)))
    .filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="app-root">
      <Sidebar route={route} setRoute={(r) => setRoute(r)} />
      <div className="main-area">
        <Topbar
          route={route}
          onCreateTest={openCreateTest}
          onOpenTags={() => setShowTagManager(true)}
          search={search}
          setSearch={setSearch}
        />

        <div className="page-content">
          {route === "user" ? (
            <div className="page user-page">
              <div className="panel left-panel">
                <h4>Filters</h4>
                <div className="tag-list">
                  <button className={filterTag === "all" ? "tag active" : "tag"} onClick={() => setFilterTag("all")}>All</button>
                  {tags.filter(t => t.id !== "all").map((tg) => (
                    <button key={tg.id} className={filterTag === tg.id ? "tag active" : "tag"} onClick={() => setFilterTag(tg.id)}>{tg.name}</button>
                  ))}
                </div>
              </div>

              <div className="panel content-panel">
                <div className="content-header">
                  <h2>Available Tests</h2>
                  <div className="small-actions">
                    <button onClick={() => { setFilterTag("all"); setSearch(""); }}>Reset</button>
                    <button onClick={() => setShowTagManager(true)}>Manage Tags</button>
                  </div>
                </div>

                <div className="card-grid">
                  {displayed.map((t) => (
                    <TestCard
                      key={t.id}
                      test={t}
                      tags={tags}
                      onView={() => openView(t.id)}
                      onEdit={() => triggerEditTest(t.id)}
                      onCopy={() => triggerCopy(t.id)}
                      onDelete={() => deleteTest(t.id)}
                    />
                  ))}
                  {displayed.length === 0 && <div className="empty">No tests found</div>}
                </div>
              </div>
            </div>
          ) : (
            <div className="page admin-page">
              <div className="admin-top">
                <h2>Admin Dashboard</h2>
                <div className="admin-stats">
                  <div className="stat">
                    <div className="num">{tests.length}</div>
                    <div className="label">Total Tests</div>
                  </div>
                  <div className="stat">
                    <div className="num">{tags.length}</div>
                    <div className="label">Tags</div>
                  </div>
                </div>
                <div className="admin-actions">
                  <button onClick={openCreateTest}>Create Test</button>
                  <button onClick={() => setShowTagManager(true)}>Tag Manager</button>
                </div>
              </div>

              <div className="panel admin-list-panel">
                <h3>Manage Tests</h3>
                <div className="table">
                  <div className="row header">
                    <div className="cell">Name</div>
                    <div className="cell">Tags</div>
                    <div className="cell">Questions</div>
                    <div className="cell">Last Modified</div>
                    <div className="cell">Actions</div>
                  </div>
                  {tests.map((t) => (
                    <div key={t.id} className="row">
                      <div className="cell">{t.name}</div>
                      <div className="cell">
                        {t.tags.map(id => (tags.find(x => x.id === id) || {name:'—'}).name).join(", ")}
                      </div>
                      <div className="cell">{t.questions.length}</div>
                      <div className="cell">{new Date(t.lastModified).toLocaleString()}</div>
                      <div className="cell">
                        <button onClick={() => triggerEditTest(t.id)}>Edit</button>
                        <button onClick={() => triggerCopy(t.id)}>Copy</button>
                        <button className="danger" onClick={() => deleteTest(t.id)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        {showTestModal && editingTest && (
          <Modal onClose={() => { setShowTestModal(false); setEditingTest(null); }}>
            <TestForm
              tags={tags.filter(t => t.id !== "all")}
              initial={editingTest}
              onCancel={() => { setShowTestModal(false); setEditingTest(null); }}
              onSave={saveTest}
            />
          </Modal>
        )}

        {showTagManager && (
          <Modal onClose={() => setShowTagManager(false)}>
            <TagManager
              tags={tags.filter(t => t.id !== "all")}
              onCreate={(name) => createTag(name)}
              onEdit={(id, name) => editTag(id, name)}
              onDelete={(id) => deleteTag(id)}
              onClose={() => setShowTagManager(false)}
            />
          </Modal>
        )}

        {copyModal.open && copyModal.test && (
          <Modal onClose={() => setCopyModal({ open: false, test: null })}>
            <div className="copy-modal">
              <h3>Copy Test</h3>
              <input id="copyName" defaultValue={`${copyModal.test.name} (copy)`} />
              <div className="modal-row">
                <button onClick={() => setCopyModal({ open: false, test: null })}>Cancel</button>
                <button onClick={() => confirmCopy(document.getElementById("copyName").value)}>Save Copy</button>
              </div>
            </div>
          </Modal>
        )}

        {viewModal.open && viewModal.test && (
          <Modal onClose={() => setViewModal({ open: false, test: null, shown: 4 })}>
            <div className="view-modal">
              <h3>{viewModal.test.name}</h3>
              <div className="meta">Last modified: {new Date(viewModal.test.lastModified).toLocaleString()}</div>
              <div className="questions-list">
                {viewModal.test.questions.slice(0, viewModal.shown).map((q) => <div key={q.id} className="q">{q.text}</div>)}
              </div>
              {viewModal.shown < viewModal.test.questions.length && (
                <div className="modal-row">
                  <button onClick={() => setViewModal({ ...viewModal, shown: viewModal.shown + 4 })}>Load more</button>
                </div>
              )}
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}

/* --- Subcomponents --- */

function Sidebar({ route, setRoute }) {
  return (
    <div className="sidebar">
      <div className="brand">
        <div className="logo">JD</div>
        <div className="title">LMS Admin</div>
      </div>
      <nav>
        <button className={route === "user" ? "nav active" : "nav"} onClick={() => setRoute("user")}>User - Tests</button>
        <button className={route === "admin" ? "nav active" : "nav"} onClick={() => setRoute("admin")}>Admin</button>
      </nav>
      <div className="sidebar-foot">v1.0</div>
    </div>
  );
}

function Topbar({ route, onCreateTest, onOpenTags, search, setSearch }) {
  return (
    <div className="topbar">
      <div className="left">
        <h1>{route === "user" ? "Tests" : "Admin"}</h1>
      </div>
      <div className="right">
        <input className="search" placeholder="Search tests..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <button onClick={onOpenTags}>Tags</button>
        <button onClick={onCreateTest}>New Test</button>
      </div>
    </div>
  );
}

function TestCard({ test, tags, onView, onEdit, onCopy, onDelete }) {
  return (
    <div className="test-card">
      <div className="card-head">
        <h3>{test.name}</h3>
        <div className="qcount">{test.questions.length} Q</div>
      </div>
      <div className="card-tags">
        {test.tags.map((id) => {
          const tg = tags.find(t => t.id === id);
          return <span key={id} className="pill">{tg ? tg.name : "—"}</span>;
        })}
      </div>
      <div className="card-foot">
        <div className="modified">Last: {new Date(test.lastModified).toLocaleDateString()}</div>
        <div className="card-actions">
          <button onClick={onView}>View</button>
          <button onClick={onEdit}>Edit</button>
          <button onClick={onCopy}>Copy</button>
          <button className="danger" onClick={onDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="overlay" onMouseDown={onClose}>
      <div className="modal-box" onMouseDown={(e) => e.stopPropagation()}>
        <button className="close-x" onClick={onClose}>✕</button>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
}

function TestForm({ tags, initial, onSave, onCancel }) {
  const [name, setName] = useState(initial.name || "");
  const [selected, setSelected] = useState(initial.tags || []);
  const [questions, setQuestions] = useState(initial.questions || []);

  useEffect(() => {
    setName(initial.name || "");
    setSelected(initial.tags || []);
    setQuestions(initial.questions || []);
  }, [initial]);

  function toggleTag(id) {
    setSelected((s) => (s.includes(id) ? s.filter(x => x !== id) : [...s, id]));
  }
  function addQuestion() {
    setQuestions((q) => [...q, { id: Date.now().toString(), text: `New question ${q.length + 1}` }]);
  }
  function updateQuestion(id, text) {
    setQuestions((q) => q.map(x => x.id === id ? { ...x, text } : x));
  }
  function removeQuestion(id) {
    setQuestions((q) => q.filter(x => x.id !== id));
  }
  function submit() {
    onSave({ id: initial.id, name: name.trim(), tags: selected, questions });
  }

  return (
    <div className="form">
      <h3>{initial.id ? "Edit Test" : "Create Test"}</h3>
      <label>Test name</label>
      <input value={name} onChange={(e) => setName(e.target.value)} />

      <label>Assign tags</label>
      <div className="tag-assign">
        {tags.map((tg) => (
          <label key={tg.id} className="tag-checkbox">
            <input type="checkbox" checked={selected.includes(tg.id)} onChange={() => toggleTag(tg.id)} /> {tg.name}
          </label>
        ))}
        {tags.length === 0 && <div className="muted">No tags. Create some in Tag Manager.</div>}
      </div>

      <label>Questions</label>
      <div className="questions">
        {questions.map((q) => (
          <div key={q.id} className="question-row">
            <input value={q.text} onChange={(e) => updateQuestion(q.id, e.target.value)} />
            <button className="danger" onClick={() => removeQuestion(q.id)}>Delete</button>
          </div>
        ))}
      </div>
      <div className="row">
        <button onClick={addQuestion}>Add question</button>
      </div>

      <div className="row actions">
        <button className="muted" onClick={onCancel}>Cancel</button>
        <button onClick={submit}>{initial.id ? "Save" : "Create"}</button>
      </div>
    </div>
  );
}

function TagManager({ tags, onCreate, onEdit, onDelete, onClose }) {
  const [newName, setNewName] = useState("");
  const [editing, setEditing] = useState({ id: null, val: "" });

  function add() {
    if (!newName.trim()) return;
    onCreate(newName.trim());
    setNewName("");
  }
  function startEdit(t) {
    setEditing({ id: t.id, val: t.name });
  }
  function saveEdit() {
    onEdit(editing.id, editing.val);
    setEditing({ id: null, val: "" });
  }

  return (
    <div className="tagmanager">
      <h3>Tag Manager</h3>
      <div className="row">
        <input placeholder="New tag name" value={newName} onChange={(e) => setNewName(e.target.value)} />
        <button onClick={add}>Add</button>
      </div>

      <div className="tags-list">
        {tags.map((t) => (
          <div key={t.id} className="tag-row">
            {editing.id === t.id ? (
              <>
                <input value={editing.val} onChange={(e) => setEditing(s => ({ ...s, val: e.target.value }))} />
                <button onClick={saveEdit}>Save</button>
                <button onClick={() => setEditing({ id: null, val: "" })}>Cancel</button>
              </>
            ) : (
              <>
                <div className="tag-name">{t.name}</div>
                <div className="tag-actions">
                  <button onClick={() => startEdit(t)}>Edit</button>
                  <button className="danger" onClick={() => onDelete(t.id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="row actions">
        <button className="muted" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
