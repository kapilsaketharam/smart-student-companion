import { useEffect, useMemo, useState } from 'react'
import {
  LayoutDashboard, CheckSquare, CalendarDays, NotebookPen, ChartNoAxesCombined,
  Search, Bell, Plus, Clock3, BookOpen, Flame, CircleCheck, Circle, MoreHorizontal,
  ChevronRight, Calendar, X, Trash2, GraduationCap, Sparkles, Menu, ArrowUpRight,
  Target, Pencil, Check, Filter,
} from 'lucide-react'

const initialTasks = [
  { id: 1, title: 'Review React hooks', subject: 'MFEF', due: '2026-10-22', priority: 'High', done: false },
  { id: 2, title: 'Complete KNN lab record', subject: 'Machine Learning', due: '2026-10-23', priority: 'Medium', done: false },
  { id: 3, title: 'Practice transportation problems', subject: 'Optimization Techniques', due: '2026-10-24', priority: 'High', done: true },
  { id: 4, title: 'Revise IPv4 and IPv6 headers', subject: 'Computer Networks', due: '2026-10-25', priority: 'Low', done: false },
]
const initialNotes = [
  { id: 1, title: 'React hooks — quick recap', subject: 'MFEF', body: 'useState stores component state. useEffect runs side effects after render. Keep components small and reusable.', color: 'lavender', updated: 'Today' },
  { id: 2, title: 'KNN key points', subject: 'Machine Learning', body: 'Choose K, calculate distances, select the K nearest neighbours, and use majority voting for classification.', color: 'mint', updated: 'Yesterday' },
  { id: 3, title: 'CN exam checklist', subject: 'Computer Networks', body: 'Revise virtual circuit vs datagram, router components, NAT, and fragmentation.', color: 'peach', updated: 'Oct 19' },
]
const initialSchedule = [
  { id: 1, time: '09:00 AM', end: '10:00 AM', subject: 'Modern Front-End Frameworks', room: 'Lab 2', color: 'purple' },
  { id: 2, time: '10:15 AM', end: '11:15 AM', subject: 'Machine Learning', room: 'Room 304', color: 'blue' },
  { id: 3, time: '11:30 AM', end: '12:30 PM', subject: 'Computer Networks', room: 'Room 201', color: 'green' },
  { id: 4, time: '02:00 PM', end: '03:00 PM', subject: 'Optimization Techniques', room: 'Room 105', color: 'orange' },
]
const navItems = [
  { id: 'Overview', icon: LayoutDashboard },
  { id: 'My Tasks', icon: CheckSquare },
  { id: 'Timetable', icon: CalendarDays },
  { id: 'My Notes', icon: NotebookPen },
  { id: 'Progress', icon: ChartNoAxesCombined },
]
const readStore = (key, fallback) => {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback }
  catch { return fallback }
}
const todayLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
const dateISO = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

function App() {
  const [active, setActive] = useState('Overview')
  const [tasks, setTasks] = useState(() => readStore('ssc-tasks', initialTasks))
  const [notes, setNotes] = useState(() => readStore('ssc-notes', initialNotes))
  const [schedule, setSchedule] = useState(() => readStore('ssc-schedule', initialSchedule))
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [modal, setModal] = useState(null)
  const [mobileNav, setMobileNav] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => { localStorage.setItem('ssc-tasks', JSON.stringify(tasks)) }, [tasks])
  useEffect(() => { localStorage.setItem('ssc-notes', JSON.stringify(notes)) }, [notes])
  useEffect(() => { localStorage.setItem('ssc-schedule', JSON.stringify(schedule)) }, [schedule])
  useEffect(() => { if (toast) { const timer = setTimeout(() => setToast(''), 2400); return () => clearTimeout(timer) } }, [toast])

  const completed = tasks.filter(t => t.done).length
  const pending = tasks.filter(t => !t.done).length
  const completion = tasks.length ? Math.round(completed / tasks.length * 100) : 0
  const filteredTasks = useMemo(() => tasks.filter(t => {
    const matches = `${t.title} ${t.subject}`.toLowerCase().includes(query.toLowerCase())
    const status = filter === 'All' || (filter === 'Completed' && t.done) || (filter === 'Pending' && !t.done)
    return matches && status
  }), [tasks, query, filter])

  const toggleTask = id => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  const deleteTask = id => { setTasks(prev => prev.filter(t => t.id !== id)); setToast('Task deleted') }
  const addTask = task => { setTasks(prev => [{ ...task, id: Date.now(), done: false }, ...prev]); setModal(null); setToast('Task added successfully') }
  const addNote = note => { setNotes(prev => [{ ...note, id: Date.now(), updated: 'Just now' }, ...prev]); setModal(null); setToast('Note saved successfully') }
  const addClass = item => { setSchedule(prev => [...prev, { ...item, id: Date.now() }].sort((a,b) => a.time.localeCompare(b.time))); setModal(null); setToast('Class added to timetable') }

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><GraduationCap size={23}/></div><div><strong>study<span>mate</span></strong><small>STUDENT COMPANION</small></div><button className="mobile-close icon-button" onClick={() => setMobileNav(false)} aria-label="Close menu"><X size={19}/></button></div>
      <div className="profile-mini"><div className="avatar">SR</div><div className="profile-copy"><strong>Student Workspace</strong><span>B.Tech · Semester 3-1</span></div><MoreHorizontal size={19} className="muted"/></div>
      <p className="nav-label">WORKSPACE</p>
      <nav>{navItems.map(item => { const Icon = item.icon; return <button key={item.id} className={`nav-item ${active === item.id ? 'active' : ''}`} onClick={() => { setActive(item.id); setMobileNav(false) }}><Icon size={19}/><span>{item.id}</span>{item.id === 'My Tasks' && <span className="nav-count">{pending}</span>}</button> })}</nav>
      <div className="sidebar-bottom"><div className="focus-card"><div className="focus-icon"><Sparkles size={18}/></div><strong>Small steps add up.</strong><p>Keep showing up for your goals. You're making progress!</p><div className="focus-progress"><span style={{width: `${completion}%`}}/></div><small>{completion}% of tasks completed</small></div><div className="sidebar-foot"><span className="status-dot"/> Your data stays on this device</div></div>
    </aside>
    {mobileNav && <button className="scrim" onClick={() => setMobileNav(false)} aria-label="Close navigation"/>}
    <main className="main-area">
      <header className="topbar"><button className="mobile-menu icon-button" onClick={() => setMobileNav(true)} aria-label="Open menu"><Menu size={21}/></button><div className="breadcrumb">Workspace <ChevronRight size={14}/> <strong>{active}</strong></div><div className="top-actions"><div className="search-box"><Search size={17}/><input aria-label="Search tasks and notes" placeholder="Search anything..." value={query} onChange={e => setQuery(e.target.value)}/><kbd>⌘ K</kbd></div><button className="icon-button notification" title="Notifications" onClick={() => setToast(`${pending} task${pending === 1 ? '' : 's'} still pending`)}><Bell size={19}/><i/></button><div className="top-avatar">SR</div></div></header>
      <div className="page-content">
        {active === 'Overview' && <Overview tasks={tasks} notes={notes} schedule={schedule} completed={completed} pending={pending} completion={completion} setActive={setActive} toggleTask={toggleTask} setModal={setModal} />}
        {active === 'My Tasks' && <TasksPage tasks={filteredTasks} filter={filter} setFilter={setFilter} toggleTask={toggleTask} deleteTask={deleteTask} setModal={setModal} />}
        {active === 'Timetable' && <TimetablePage schedule={schedule} setModal={setModal} />}
        {active === 'My Notes' && <NotesPage notes={notes} query={query} setModal={setModal} setNotes={setNotes} />}
        {active === 'Progress' && <ProgressPage tasks={tasks} completed={completed} pending={pending} completion={completion} notes={notes} schedule={schedule} />}
        <footer className="footer"><span>Made for your next big step <span className="heart">♥</span></span><span>Smart Student Companion <b>·</b> v1.0</span></footer>
      </div>
    </main>
    {modal && <Modal type={modal} onClose={() => setModal(null)} onAddTask={addTask} onAddNote={addNote} onAddClass={addClass} />}
    {toast && <div className="toast"><CircleCheck size={18}/>{toast}</div>}
  </div>
}

function PageHeading({eyebrow, title, description, action, onAction}) {
  return <div className="page-heading"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="page-description">{description}</p></div>{action && <button className="primary-button" onClick={onAction}><Plus size={17}/>{action}</button>}</div>
}
function Overview({tasks, notes, schedule, completed, pending, completion, setActive, toggleTask, setModal}) {
  const nextTasks = tasks.filter(t => !t.done).slice(0, 4)
  return <>
    <div className="welcome-banner"><div className="welcome-copy"><div className="welcome-tag"><Sparkles size={14}/> YOUR PERSONAL STUDY SPACE</div><h1>Make today <span>count.</span></h1><p>A little progress every day adds up to big results. Let's get things done.</p><div className="welcome-meta"><span><CalendarDays size={15}/>{todayLabel}</span><span className="meta-divider"/><span><Flame size={15}/>Keep your momentum going</span></div></div><div className="banner-art"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-book"><BookOpen size={62} strokeWidth={1.2}/></div><div className="float-badge badge-check"><CircleCheck size={18}/></div><div className="float-badge badge-star"><Sparkles size={18}/></div></div></div>
    <div className="stats-grid"><StatCard label="Total tasks" value={tasks.length} hint="Across all subjects" icon={CheckSquare} tone="purple"/><StatCard label="Completed" value={completed} hint={`${completion}% completion rate`} icon={CircleCheck} tone="green"/><StatCard label="Pending tasks" value={pending} hint="One step at a time" icon={Clock3} tone="orange"/><StatCard label="Study notes" value={notes.length} hint="Ideas worth keeping" icon={NotebookPen} tone="blue"/></div>
    <div className="content-grid"><section className="panel task-panel"><div className="panel-heading"><div><h2>Up next</h2><p>Your tasks that need attention</p></div><button className="text-button" onClick={() => setActive('My Tasks')}>View all <ArrowUpRight size={15}/></button></div>{nextTasks.length ? <div className="task-list">{nextTasks.map(task => <TaskRow key={task.id} task={task} onToggle={toggleTask}/>)}</div> : <EmptyState icon={CircleCheck} title="All caught up!" text="You've completed every task."/>}<button className="add-inline" onClick={() => setModal('task')}><Plus size={17}/> Add a new task</button></section>
    <section className="panel schedule-panel"><div className="panel-heading"><div><h2>Today's schedule</h2><p>A plan makes the day easier</p></div><button className="round-button" title="Add class" onClick={() => setModal('class')}><Plus size={17}/></button></div>{schedule.length ? <div className="schedule-list">{schedule.slice(0,4).map(item => <ScheduleRow key={item.id} item={item}/>)}</div> : <EmptyState icon={CalendarDays} title="No classes yet" text="Add your first timetable entry."/>}<button className="bottom-link" onClick={() => setActive('Timetable')}>View full timetable <ChevronRight size={16}/></button></section></div>
    <section className="progress-strip"><div className="progress-emblem"><Target size={22}/></div><div className="progress-copy"><strong>You're building good habits</strong><span>You've completed {completed} out of {tasks.length} tasks. Keep going!</span></div><div className="progress-track"><span style={{width:`${completion}%`}}/></div><strong className="progress-number">{completion}%</strong><button className="icon-button" onClick={() => setActive('Progress')} aria-label="View progress"><ChevronRight size={19}/></button></section>
  </>
}
function StatCard({label,value,hint,icon:Icon,tone}) { return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={20}/></div><span className="stat-label">{label}</span><div className="stat-value">{value}</div><span className="stat-hint">{hint}</span></div> }
function TaskRow({task,onToggle,onDelete}) { return <div className={`task-row ${task.done ? 'task-done' : ''}`}><button className="check-button" onClick={() => onToggle(task.id)} aria-label={task.done ? 'Mark incomplete' : 'Mark complete'}>{task.done ? <CircleCheck size={21} className="checked"/> : <Circle size={21}/>}</button><div className="task-info"><strong>{task.title}</strong><span>{task.subject}</span></div><div className="task-end"><span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span><span className="task-due"><Calendar size={13}/>{task.due === dateISO(new Date()) ? 'Today' : new Date(`${task.due}T12:00:00`).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</span>{onDelete && <button className="icon-button delete-button" onClick={() => onDelete(task.id)} aria-label="Delete task"><Trash2 size={16}/></button>}</div></div> }
function ScheduleRow({item}) { return <div className="schedule-row"><div className={`schedule-line ${item.color}`}/><div className="schedule-time"><strong>{item.time}</strong><span>{item.end}</span></div><div className="schedule-info"><strong>{item.subject}</strong><span>{item.room}</span></div><span className={`schedule-dot ${item.color}`}/></div> }
function EmptyState({icon:Icon,title,text}) { return <div className="empty-state"><Icon size={25}/><strong>{title}</strong><span>{text}</span></div> }
function TasksPage({tasks,filter,setFilter,toggleTask,deleteTask,setModal}) { return <><PageHeading eyebrow="STAY ON TRACK" title="My tasks" description="Turn your to-dos into done. One task at a time." action="Add task" onAction={() => setModal('task')}/><div className="panel full-panel"><div className="list-toolbar"><div className="filter-label"><Filter size={16}/> Filter by status</div><div className="filter-tabs">{['All','Pending','Completed'].map(f => <button key={f} className={filter===f?'selected':''} onClick={() => setFilter(f)}>{f}</button>)}</div><span className="result-count">{tasks.length} task{tasks.length===1?'':'s'}</span></div>{tasks.length ? <div className="task-list roomy">{tasks.map(task => <TaskRow key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask}/>)}</div> : <EmptyState icon={CheckSquare} title="No tasks found" text="Try another filter or add a new task."/>}</div></> }
function TimetablePage({schedule,setModal}) { const days=['Mon','Tue','Wed','Thu','Fri']; return <><PageHeading eyebrow="PLAN YOUR DAY" title="Timetable" description="A clear plan gives your best work room to happen." action="Add class" onAction={() => setModal('class')}/><div className="week-strip">{days.map((d,i)=><div className={`week-day ${i===2?'today':''}`} key={d}><span>{d}</span><strong>{19+i}</strong>{i===2&&<small>Today</small>}</div>)}</div><section className="panel full-panel"><div className="panel-heading"><div><h2>Class schedule</h2><p>{todayLabel}</p></div><span className="soft-pill">{schedule.length} sessions</span></div>{schedule.length ? <div className="schedule-list timetable-list">{schedule.map(item=><ScheduleRow key={item.id} item={item}/>)}</div>:<EmptyState icon={CalendarDays} title="Your timetable is empty" text="Add your classes to plan your day."/>}</section><p className="helper-note">Tip: This sample timetable is editable. Add your own subjects, timings, and room details.</p></> }
function NotesPage({notes,query,setModal,setNotes}) { const visible=notes.filter(n=>`${n.title} ${n.subject} ${n.body}`.toLowerCase().includes(query.toLowerCase())); return <><PageHeading eyebrow="SAVE YOUR IDEAS" title="My notes" description="Keep important concepts and revision points close by." action="New note" onAction={() => setModal('note')}/>{visible.length ? <div className="notes-grid">{visible.map(note=><article className={`note-card ${note.color}`} key={note.id}><div className="note-top"><span>{note.subject}</span><button className="icon-button" title="Delete note" onClick={() => setNotes(prev=>prev.filter(n=>n.id!==note.id))}><Trash2 size={16}/></button></div><h2>{note.title}</h2><p>{note.body}</p><div className="note-footer"><span><NotebookPen size={14}/>{note.updated}</span><span>Quick note</span></div></article>)}</div>:<div className="panel full-panel"><EmptyState icon={NotebookPen} title="No notes found" text="Try a different search or create a new note."/></div>}</> }
function ProgressPage({tasks,completed,pending,completion,notes,schedule}) { const subjects=[...new Set(tasks.map(t=>t.subject))]; return <><PageHeading eyebrow="YOUR GROWTH" title="Progress overview" description="Notice what you've done, then choose your next step."/><div className="progress-hero"><div className="progress-ring" style={{'--progress':`${completion*3.6}deg`}}><div><strong>{completion}%</strong><span>completed</span></div></div><div className="progress-hero-copy"><span className="soft-pill"><Sparkles size={13}/> YOUR MOMENTUM</span><h2>{completion === 100 ? 'Amazing work!' : completion >= 60 ? "You're doing great!" : completion >= 30 ? 'You are making progress.' : 'Every start matters.'}</h2><p>You've completed <b>{completed}</b> of your <b>{tasks.length}</b> tasks. Keep your goals realistic and celebrate every small win.</p><div className="mini-stats"><span><CircleCheck size={16}/>{completed} completed</span><span><Clock3 size={16}/>{pending} pending</span></div></div></div><div className="stats-grid progress-stats"><StatCard label="Tasks completed" value={completed} hint="Work you've finished" icon={CircleCheck} tone="green"/><StatCard label="Tasks remaining" value={pending} hint="Your next opportunities" icon={Clock3} tone="orange"/><StatCard label="Notes collected" value={notes.length} hint="Knowledge saved" icon={NotebookPen} tone="purple"/><StatCard label="Classes planned" value={schedule.length} hint="Sessions in timetable" icon={CalendarDays} tone="blue"/></div><section className="panel full-panel subject-panel"><div className="panel-heading"><div><h2>Tasks by subject</h2><p>A simple snapshot of your study areas</p></div></div>{subjects.length?subjects.map(subject=>{const group=tasks.filter(t=>t.subject===subject);const done=group.filter(t=>t.done).length;const pct=Math.round(done/group.length*100);return <div className="subject-progress" key={subject}><div><strong>{subject}</strong><span>{done} of {group.length} complete</span></div><div className="subject-track"><span style={{width:`${pct}%`}}/></div><b>{pct}%</b></div>}):<EmptyState icon={BookOpen} title="No subject data yet" text="Add tasks to see your progress by subject."/>}</section></> }
function Modal({type,onClose,onAddTask,onAddNote,onAddClass}) {
  const [form,setForm]=useState({title:'',subject:'',due:dateISO(new Date()),priority:'Medium',body:'',color:'lavender',time:'09:00 AM',end:'10:00 AM',room:'Room 101',subjectClass:'',colorClass:'purple'})
  const update=(key,value)=>setForm(prev=>({...prev,[key]:value}))
  const submit=e=>{e.preventDefault();if(type==='task')onAddTask({title:form.title.trim(),subject:form.subject.trim(),due:form.due,priority:form.priority});if(type==='note')onAddNote({title:form.title.trim(),subject:form.subject.trim(),body:form.body.trim(),color:form.color});if(type==='class')onAddClass({time:form.time,end:form.end,subject:form.subjectClass.trim(),room:form.room.trim(),color:form.colorClass})}
  const title=type==='task'?'Add a task':type==='note'?'Create a note':'Add a class'
  return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-heading"><div><span className="eyebrow">MAKE IT HAPPEN</span><h2 id="modal-title">{title}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={20}/></button></div><form onSubmit={submit}>
    {type==='task'&&<><label>Task title<input required autoFocus maxLength="90" placeholder="e.g. Revise React hooks" value={form.title} onChange={e=>update('title',e.target.value)}/></label><label>Subject<input required placeholder="e.g. MFEF" value={form.subject} onChange={e=>update('subject',e.target.value)}/></label><div className="form-row"><label>Due date<input required type="date" value={form.due} onChange={e=>update('due',e.target.value)}/></label><label>Priority<select value={form.priority} onChange={e=>update('priority',e.target.value)}><option>Low</option><option>Medium</option><option>High</option></select></label></div></>}
    {type==='note'&&<><label>Note title<input required autoFocus placeholder="Give your note a title" value={form.title} onChange={e=>update('title',e.target.value)}/></label><label>Subject<input required placeholder="e.g. Machine Learning" value={form.subject} onChange={e=>update('subject',e.target.value)}/></label><label>Note content<textarea required rows="5" placeholder="Write your key points here..." value={form.body} onChange={e=>update('body',e.target.value)}/></label><label>Card colour<select value={form.color} onChange={e=>update('color',e.target.value)}><option value="lavender">Lavender</option><option value="mint">Mint</option><option value="peach">Peach</option></select></label></>}
    {type==='class'&&<><label>Subject / class name<input required autoFocus placeholder="e.g. Machine Learning" value={form.subjectClass} onChange={e=>update('subjectClass',e.target.value)}/></label><div className="form-row"><label>Start time<input required value={form.time} onChange={e=>update('time',e.target.value)} placeholder="09:00 AM"/></label><label>End time<input required value={form.end} onChange={e=>update('end',e.target.value)} placeholder="10:00 AM"/></label></div><div className="form-row"><label>Room / location<input required value={form.room} onChange={e=>update('room',e.target.value)} placeholder="Room 101"/></label><label>Colour<select value={form.colorClass} onChange={e=>update('colorClass',e.target.value)}><option value="purple">Purple</option><option value="blue">Blue</option><option value="green">Green</option><option value="orange">Orange</option></select></label></div></>}
    <div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button"><Check size={16}/>{type==='task'?'Save task':type==='note'?'Save note':'Save class'}</button></div>
  </form></div></div>
}

export default App
