import { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  Activity,
  ArrowUpRight,
  Bell,
  Bot,
  BookOpen,
  ChevronDown,
  Clock3,
  Filter,
  Headphones,
  Inbox,
  LayoutDashboard,
  LifeBuoy,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Settings,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  Target,
  Ticket,
  TrendingUp,
  UserRound,
  UsersRound,
  X,
  Zap,
} from 'lucide-react'
import './styles.css'

const channels = [
  { name: 'All channels', icon: Inbox, count: 248 },
  { name: 'WhatsApp', icon: MessageCircle, count: 76 },
  { name: 'Slack', icon: Zap, count: 54 },
  { name: 'Telegram', icon: SendIcon, count: 31 },
  { name: 'Website chat', icon: Headphones, count: 62 },
  { name: 'Messenger', icon: MessageCircle, count: 25 },
]

const tickets = [
  { id: '#SS-1048', title: 'Billing portal access is timing out', customer: 'Ava Mitchell', initials: 'AM', channel: 'Website chat', priority: 'High', status: 'Open', time: '8 min ago', color: 'coral' },
  { id: '#SS-1047', title: 'Unable to export the monthly report', customer: 'Noah Williams', initials: 'NW', channel: 'Slack', priority: 'Medium', status: 'Pending', time: '22 min ago', color: 'sage' },
  { id: '#SS-1046', title: 'Two-factor authentication reset', customer: 'Liam Carter', initials: 'LC', channel: 'WhatsApp', priority: 'Critical', status: 'Escalated', time: '41 min ago', color: 'plum' },
  { id: '#SS-1045', title: 'Question about team seats', customer: 'Sophia Lee', initials: 'SL', channel: 'Messenger', priority: 'Low', status: 'Resolved', time: '1 hr ago', color: 'blue' },
]

const agents = [
  { name: 'Maya Rodriguez', role: 'Senior support lead', initials: 'MR', open: 18, resolved: 94, color: 'coral' },
  { name: 'Ethan Brooks', role: 'Customer advocate', initials: 'EB', open: 12, resolved: 87, color: 'sage' },
  { name: 'Olivia Chen', role: 'Customer advocate', initials: 'OC', open: 9, resolved: 82, color: 'plum' },
]

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Tickets', icon: Ticket, badge: '24' },
  { label: 'Customers', icon: UserRound },
  { label: 'Team', icon: UsersRound },
  { label: 'Reports', icon: TrendingUp },
]

function SendIcon(props) {
  return <MessageCircle {...props} />
}

function App() {
  const [activePage, setActivePage] = useState('Overview')
  const [activeChannel, setActiveChannel] = useState('All channels')
  const [searchTerm, setSearchTerm] = useState('')
  const [mobileNav, setMobileNav] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showTicket, setShowTicket] = useState(false)
  const [toast, setToast] = useState('')
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [assistantDraft, setAssistantDraft] = useState('')
  const [assistantMessages, setAssistantMessages] = useState([
    { from: 'assistant', text: 'Hi there. I am Sphere Assist, your SupportSphere guide. How can I help you today?' },
  ])

  const visibleTickets = useMemo(() => tickets.filter((ticket) => {
    const matchesChannel = activeChannel === 'All channels' || ticket.channel === activeChannel
    const matchesSearch = `${ticket.title} ${ticket.customer} ${ticket.id}`.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesChannel && matchesSearch
  }), [activeChannel, searchTerm])

  const goTo = (label) => {
    setActivePage(label)
    setMobileNav(false)
  }

  const notify = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2400)
  }

  const sendAssistantMessage = (message = assistantDraft) => {
    const question = message.trim()
    if (!question) return
    const normalized = question.toLowerCase()
    let response = 'I can help with tickets, billing, account access, integrations, and workspace settings. Could you share a little more detail about what you need?'
    if (normalized.includes('billing') || normalized.includes('invoice') || normalized.includes('payment')) response = 'I can help with billing. Please open a ticket with your workspace name and invoice number, and our billing team will review it. I can also start that ticket for you.'
    if (normalized.includes('password') || normalized.includes('login') || normalized.includes('access')) response = 'For account access, confirm that you are using the email assigned to your workspace and request a password reset from the sign-in screen. If you are still blocked, I can create an access ticket for the support team.'
    if (normalized.includes('slack') || normalized.includes('whatsapp') || normalized.includes('telegram') || normalized.includes('integration')) response = 'SupportSphere connects Slack, WhatsApp, Telegram, Website Chat, and Messenger. An admin can enable channels from Settings, then assign an owner for incoming conversations.'
    if (normalized.includes('ticket') || normalized.includes('problem') || normalized.includes('issue')) response = 'I can help get this moving. Share the issue, affected customer, and urgency, and I will prepare the right support handoff for your team.'
    setAssistantMessages(messages => [...messages, { from: 'user', text: question }, { from: 'assistant', text: response }])
    setAssistantDraft('')
  }

  const handleShellClick = (event) => {
    const button = event.target.closest('button')
    if (!button || button.classList.contains('nav-item') || button.classList.contains('notification-button') || button.classList.contains('mobile-menu') || button.classList.contains('mobile-close') || button.classList.contains('sidebar-overlay') || button.classList.contains('full-ghost-button') || button.classList.contains('ticket-row') || button.classList.contains('channel-tabs')) return
    if (button.classList.contains('ghost-button') && !button.closest('.help-resource')) return
    notify(`${button.innerText.trim() || 'Action'} selected`)
  }

  return (
    <div className="app-shell" onClick={handleShellClick}>
      <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
        <div className="brand-lockup">
          <div className="brand-mark"><LifeBuoy size={20} strokeWidth={2.8} /></div>
          <div><strong>Support<span>Sphere</span></strong><small>Customer operations</small></div>
          <button className="icon-button mobile-close" aria-label="Close navigation" onClick={() => setMobileNav(false)}><X size={18} /></button>
        </div>

        <div className="workspace-switcher">
          <div className="workspace-avatar">N</div>
          <div><strong>Northstar Labs</strong><small>Enterprise workspace</small></div>
          <ChevronDown size={16} />
        </div>

        <nav className="main-nav" aria-label="Main navigation">
          <p className="nav-label">Workspace</p>
          {navItems.map(({ label, icon: Icon, badge }) => (
            <button key={label} className={`nav-item ${activePage === label ? 'active' : ''}`} onClick={() => goTo(label)}>
              <Icon size={18} /><span>{label}</span>{badge && <em>{badge}</em>}
            </button>
          ))}
          <p className="nav-label nav-label-spaced">Manage</p>
          <button className={`nav-item ${activePage === 'Settings' ? 'active' : ''}`} onClick={() => goTo('Settings')}><Settings size={18} /><span>Settings</span></button>
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card"><div className="help-icon"><BookOpen size={18} /></div><strong>Need a hand?</strong><p>Visit our support academy for tips and guides.</p><button onClick={() => goTo('Help center')}>Browse resources <ArrowUpRight size={14} /></button></div>
          <div className="profile-row"><div className="avatar avatar-coral">JR</div><div><strong>Jordan Ross</strong><small>Admin</small></div><MoreHorizontal size={18} /></div>
        </div>
      </aside>

      {mobileNav && <button className="sidebar-overlay" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}

      <main className="main-content">
        <header className="topbar">
          <button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setMobileNav(true)}><Menu size={21} /></button>
          <div className="breadcrumb"><span>Workspace</span><span>/</span><strong>{activePage}</strong></div>
          <div className="topbar-actions">
            <label className="search-box"><Search size={17} /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search anything" /><kbd>⌘ K</kbd></label>
            <button className={`assistant-trigger ${assistantOpen ? 'active' : ''}`} onClick={() => setAssistantOpen(!assistantOpen)}><Bot size={16} /> Sphere Assist</button>
            <div className="notification-wrap"><button className="icon-button notification-button" aria-label="Toggle notifications" onClick={() => setShowNotifications(!showNotifications)}><Bell size={19} /><i /></button>{showNotifications && <div className="notification-popover"><div><strong>Notifications</strong><span>3 new</span></div><p><ShieldAlert size={16} /> Ticket #SS-1046 was escalated</p><p><UserRound size={16} /> Maya accepted a new assignment</p><p><Target size={16} /> Weekly resolution goal reached</p></div>}</div>
            <div className="avatar avatar-coral top-avatar">JR</div>
          </div>
        </header>

        <div className="page-wrap">
          {activePage === 'Overview' && <Overview visibleTickets={visibleTickets} activeChannel={activeChannel} setActiveChannel={setActiveChannel} setShowTicket={setShowTicket} goTo={goTo} />}
          {activePage === 'Tickets' && <TicketsPage visibleTickets={visibleTickets} activeChannel={activeChannel} setActiveChannel={setActiveChannel} setShowTicket={setShowTicket} />}
          {activePage === 'Customers' && <CustomersPage goTo={goTo} notify={notify} />}
          {activePage === 'Team' && <TeamPage notify={notify} />}
          {activePage === 'Reports' && <ReportsPage notify={notify} />}
          {activePage === 'Settings' && <SettingsPage notify={notify} />}
          {activePage === 'Help center' && <HelpPage notify={notify} />}
        </div>
      </main>
      {showTicket && <TicketModal onClose={() => setShowTicket(false)} />}
      {assistantOpen && <AssistantPanel messages={assistantMessages} draft={assistantDraft} setDraft={setAssistantDraft} onSend={sendAssistantMessage} onClose={() => setAssistantOpen(false)} onCreateTicket={() => { setAssistantOpen(false); setShowTicket(true) }} />}
      {toast && <div className="toast" role="status"><Zap size={15} />{toast}</div>}
    </div>
  )
}

function PageHeader({ eyebrow, title, description, action, onAction }) {
  return <div className="page-header"><div><div className="eyebrow"><span className="eyebrow-dot" />{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action && <button className="primary-button" onClick={onAction}><Plus size={17} />{action}</button>}</div>
}

function Overview({ visibleTickets, activeChannel, setActiveChannel, setShowTicket, goTo }) {
  return <>
    <PageHeader eyebrow="Thursday, September 10, 2026" title="Good morning, Jordan" description="Here's what is happening across your support operation today." action="Create ticket" onAction={() => setShowTicket(true)} />
    <section className="metric-grid">
      <MetricCard label="Open tickets" value="248" delta="12.5%" trend="up" note="vs. last week" icon={Inbox} accent="brown" />
      <MetricCard label="Resolved today" value="186" delta="8.2%" trend="up" note="vs. yesterday" icon={Target} accent="red" />
      <MetricCard label="Avg. response time" value="14m 32s" delta="4.1%" trend="down" note="vs. last week" icon={Clock3} accent="beige" />
      <MetricCard label="Resolution rate" value="94.8%" delta="2.8%" trend="up" note="vs. last month" icon={Activity} accent="dark" />
    </section>
    <div className="content-grid top-grid">
      <section className="panel activity-panel"><div className="panel-heading"><div><h2>Support activity</h2><p>Conversations across every channel</p></div><button className="ghost-button" onClick={() => goTo('Reports')}>View reports <ArrowUpRight size={15} /></button></div><div className="chart-wrap"><div className="chart-y"><span>80</span><span>60</span><span>40</span><span>20</span><span>0</span></div><div className="chart-area"><div className="chart-lines"><i /><i /><i /><i /><i /></div><div className="bars">{[43, 52, 39, 68, 55, 76, 60, 86, 63, 72, 49, 78, 67, 90, 72, 82, 58, 75].map((height, index) => <span key={index} style={{ '--height': `${height}%` }} className={index === 13 ? 'bar-highlight' : ''} />)}</div><div className="chart-x"><span>08:00</span><span>10:00</span><span>12:00</span><span>14:00</span><span>16:00</span><span>18:00</span></div></div></div><div className="chart-legend"><span><i className="legend-red" />Incoming</span><span><i className="legend-brown" />Resolved</span><strong>+18.4% <small>this week</small></strong></div></section>
      <section className="panel channel-panel"><div className="panel-heading"><div><h2>By channel</h2><p>Open conversations</p></div><button className="icon-button"><MoreHorizontal size={19} /></button></div><div className="donut-wrap"><div className="donut"><div><strong>248</strong><span>total open</span></div></div><div className="donut-key"><ChannelKey label="Website chat" value="82" percent="33%" color="red" /><ChannelKey label="WhatsApp" value="64" percent="26%" color="brown" /><ChannelKey label="Slack" value="48" percent="19%" color="dark" /><ChannelKey label="Other channels" value="54" percent="22%" color="beige" /></div></div></section>
    </div>
    <div className="content-grid bottom-grid">
      <section className="panel table-panel"><div className="panel-heading"><div><h2>Recent tickets</h2><p>Your team's latest customer requests</p></div><button className="ghost-button" onClick={() => goTo('Tickets')}>View all tickets <ArrowUpRight size={15} /></button></div><div className="channel-tabs">{channels.slice(0, 4).map(({ name, icon: Icon, count }) => <button key={name} className={activeChannel === name ? 'active' : ''} onClick={() => setActiveChannel(name)}><Icon size={15} />{name}<span>{count}</span></button>)}</div><TicketTable tickets={visibleTickets.slice(0, 4)} onSelect={() => setShowTicket(true)} /></section>
      <section className="panel team-panel"><div className="panel-heading"><div><h2>Team pulse</h2><p>Live workload overview</p></div><button className="icon-button"><MoreHorizontal size={19} /></button></div><div className="team-list">{agents.map(agent => <div className="team-member" key={agent.name}><div className={`avatar avatar-${agent.color}`}>{agent.initials}</div><div className="member-info"><strong>{agent.name}</strong><span>{agent.open} open tickets</span></div><div className="member-score"><strong>{agent.resolved}%</strong><span>resolved</span></div></div>)}</div><button className="full-ghost-button" onClick={() => goTo('Team')}>View team performance <ArrowUpRight size={15} /></button></section>
    </div>
  </>
}

function MetricCard({ label, value, delta, trend, note, icon: Icon, accent }) { return <div className={`metric-card accent-${accent}`}><div className="metric-top"><div className="metric-icon"><Icon size={18} /></div><span className="metric-menu">•••</span></div><span className="metric-label">{label}</span><strong className="metric-value">{value}</strong><div className="metric-foot"><span className={trend === 'up' ? 'positive' : 'negative'}>{trend === 'up' ? '↗' : '↘'} {delta}</span><span>{note}</span></div></div> }
function ChannelKey({ label, value, percent, color }) { return <div className="key-row"><span><i className={`key-dot ${color}`} />{label}</span><strong>{value} <small>{percent}</small></strong></div> }
function TicketTable({ tickets: rows, onSelect }) { return <div className="ticket-table"><div className="ticket-row ticket-heading"><span>Ticket</span><span>Channel</span><span>Priority</span><span>Status</span><span /></div>{rows.length ? rows.map(ticket => <button className="ticket-row" key={ticket.id} onClick={onSelect}><div className="ticket-title"><div className={`avatar avatar-${ticket.color}`}>{ticket.initials}</div><span><strong>{ticket.title}</strong><small>{ticket.id} · {ticket.customer}</small></span></div><span className="channel-cell"><span className="channel-symbol"><MessageCircle size={13} /></span>{ticket.channel}</span><span><b className={`priority priority-${ticket.priority.toLowerCase()}`}>{ticket.priority}</b></span><span><b className={`status status-${ticket.status.toLowerCase()}`}>{ticket.status}</b></span><span className="ticket-time">{ticket.time}</span></button>) : <div className="empty-state"><Inbox size={24} /><strong>No tickets found</strong><span>Try a different channel or search term.</span></div>}</div> }

function TicketsPage({ visibleTickets, activeChannel, setActiveChannel, setShowTicket }) { return <><PageHeader eyebrow="Ticket management" title="Tickets" description="Triage, assign, and resolve every customer request." action="Create ticket" onAction={() => setShowTicket(true)} /><section className="panel full-panel"><div className="toolbar"><div className="toolbar-tabs">{['All channels', 'Open', 'Pending', 'Resolved'].map(filter => <button key={filter} className={filter === 'All channels' ? 'active' : ''}>{filter}</button>)}</div><button className="outline-button"><Filter size={15} /> Filters <span>2</span></button></div><div className="channel-tabs wide-tabs">{channels.map(({ name, icon: Icon, count }) => <button key={name} className={activeChannel === name ? 'active' : ''} onClick={() => setActiveChannel(name)}><Icon size={15} />{name}<span>{count}</span></button>)}</div><TicketTable tickets={visibleTickets} onSelect={() => setShowTicket(true)} /></section></> }
function CustomersPage({ goTo }) { return <><PageHeader eyebrow="Customer relationships" title="Customers" description="Know the people behind every conversation." action="Add customer" onAction={() => {}} /><div className="customer-grid">{[['Ava Mitchell','ava@northstar.io','12 tickets','coral','AM'],['Noah Williams','noah@meridian.co','8 tickets','sage','NW'],['Liam Carter','liam@atlas.design','5 tickets','plum','LC'],['Sophia Lee','sophia@tandem.com','3 tickets','blue','SL']].map(customer => <div className="panel customer-card" key={customer[0]}><div className={`avatar avatar-${customer[3]}`}>{customer[4]}</div><div><h3>{customer[0]}</h3><p>{customer[1]}</p></div><button className="icon-button"><MoreHorizontal size={18} /></button><div className="customer-meta"><span><Ticket size={14} />{customer[2]}</span><span className="customer-active"><i />Active now</span></div><button className="full-ghost-button" onClick={() => goTo('Tickets')}>View profile <ArrowUpRight size={15} /></button></div>)}</div></> }
function TeamPage() { return <><PageHeader eyebrow="People & permissions" title="Team" description="Keep your support team balanced, focused, and celebrated." action="Invite teammate" onAction={() => {}} /><section className="panel full-panel"><div className="panel-heading"><div><h2>Agent performance</h2><p>September 1–10, 2026</p></div><button className="outline-button"><SlidersHorizontal size={15} /> This month <ChevronDown size={14} /></button></div><div className="agent-cards">{agents.map(agent => <div className="agent-card" key={agent.name}><div className="agent-card-head"><div className={`avatar avatar-${agent.color}`}>{agent.initials}</div><div><h3>{agent.name}</h3><p>{agent.role}</p></div><span className="online-dot" /></div><div className="agent-stats"><div><strong>{agent.open}</strong><span>Open tickets</span></div><div><strong>{agent.resolved}</strong><span>Resolved</span></div><div><strong>4m</strong><span>Avg response</span></div></div><div className="progress-label"><span>Weekly capacity</span><strong>{agent.resolved + 2}%</strong></div><div className="progress"><i style={{ width: `${agent.resolved + 2}%` }} /></div></div>)}</div></section></> }
function ReportsPage() { return <><PageHeader eyebrow="Insights & reporting" title="Reports" description="Turn support activity into a better customer experience." action="Export report" onAction={() => {}} /><section className="report-layout"><div className="panel report-main"><div className="panel-heading"><div><h2>Resolution performance</h2><p>Tickets resolved over the last 30 days</p></div><button className="outline-button">Last 30 days <ChevronDown size={14} /></button></div><div className="report-chart"><div className="report-stat"><strong>1,842</strong><span>tickets resolved</span><b>↗ 12.8%</b></div><div className="line-chart"><div className="chart-lines"><i /><i /><i /><i /></div><svg viewBox="0 0 620 190" preserveAspectRatio="none"><path d="M0 155 C42 140, 65 160, 100 126 S155 90, 190 120 S235 135, 270 92 S335 102, 370 70 S420 92, 455 55 S520 74, 550 37 S590 50, 620 20" fill="none" stroke="var(--red)" strokeWidth="4" strokeLinecap="round" /></svg><div className="chart-x"><span>Aug 12</span><span>Aug 19</span><span>Aug 26</span><span>Sep 02</span><span>Sep 10</span></div></div></div></div><div className="panel score-panel"><div className="panel-heading"><div><h2>CSAT score</h2><p>Customer satisfaction</p></div><MoreHorizontal size={18} /></div><strong className="score">4.8<span>/5</span></strong><div className="stars">★★★★★</div><p className="score-note">Based on 1,204 responses</p><div className="score-bars"><span><i style={{ width: '91%' }} /><b>5</b></span><span><i style={{ width: '65%' }} /><b>4</b></span><span><i style={{ width: '23%' }} /><b>3</b></span><span><i style={{ width: '8%' }} /><b>2</b></span><span><i style={{ width: '4%' }} /><b>1</b></span></div></div></section></> }
function SettingsPage() { return <><PageHeader eyebrow="Workspace configuration" title="Settings" description="Configure SupportSphere around the way your team works." /><div className="settings-layout"><div className="settings-nav"><button className="active"><Settings size={16} />General</button><button><MessageCircle size={16} />Integrations</button><button><Bell size={16} />Notifications</button><button><UsersRound size={16} />Members & roles</button></div><section className="panel settings-panel"><div className="panel-heading"><div><h2>General settings</h2><p>Manage your workspace identity and preferences.</p></div></div><label className="field-label">Workspace name<input defaultValue="Northstar Labs" /></label><label className="field-label">Workspace URL<div className="input-prefix"><span>support-sphere.com/</span><input defaultValue="northstar-labs" /></div></label><label className="toggle-row"><span><strong>Show customer satisfaction survey</strong><small>Ask customers for feedback after every resolved ticket.</small></span><i className="toggle on" /></label><label className="toggle-row"><span><strong>Business hours</strong><small>Only notify agents during configured work hours.</small></span><i className="toggle on" /></label><button className="primary-button save-button">Save changes</button></section></div></> }
function HelpPage() { return <><PageHeader eyebrow="Support academy" title="Help center" description="Practical resources for making every support interaction count." /><div className="help-grid"><div className="panel help-resource"><div className="resource-icon red"><BookOpen size={20} /></div><h2>Support playbook</h2><p>Build a consistent, thoughtful support experience with proven workflows.</p><button className="ghost-button">Read guide <ArrowUpRight size={15} /></button></div><div className="panel help-resource"><div className="resource-icon brown"><Zap size={20} /></div><h2>Get started with channels</h2><p>Connect your customer channels and bring every conversation into one view.</p><button className="ghost-button">Explore integrations <ArrowUpRight size={15} /></button></div><div className="panel help-resource"><div className="resource-icon beige"><LifeBuoy size={20} /></div><h2>Contact our team</h2><p>Have a question? Our specialists are ready to help you get more from SupportSphere.</p><button className="ghost-button">Send a message <ArrowUpRight size={15} /></button></div></div></> }
function AssistantPanel({ messages, draft, setDraft, onSend, onClose, onCreateTicket }) { return <section className="assistant-panel" aria-label="Sphere Assist support assistant"><div className="assistant-header"><div className="assistant-identity"><div className="assistant-avatar"><Bot size={18} /></div><div><strong>Sphere Assist</strong><span><i />Available 24/7</span></div></div><button className="icon-button" aria-label="Close assistant" onClick={onClose}><X size={17} /></button></div><div className="assistant-intro"><span>Support assistant</span><p>Get quick answers or connect a question to your support team.</p></div><div className="assistant-messages">{messages.map((message, index) => <div className={`assistant-message ${message.from}`} key={`${message.from}-${index}`}>{message.from === 'assistant' && <Bot size={14} />}{message.text}</div>)}</div><div className="assistant-suggestions"><button onClick={() => onSend('How do I connect Slack?')}>Connect Slack</button><button onClick={() => onSend('I have a billing problem')}>Billing help</button><button onClick={() => onSend('I need help with a ticket')}>Ticket support</button></div><form className="assistant-composer" onSubmit={event => { event.preventDefault(); onSend() }}><input value={draft} onChange={event => setDraft(event.target.value)} placeholder="Ask a support question..." aria-label="Ask Sphere Assist" /><button type="submit" aria-label="Send question"><Send size={16} /></button></form><button className="assistant-ticket-link" onClick={onCreateTicket}><Plus size={14} /> Create a support ticket</button></section> }
function TicketModal({ onClose }) { return <div className="modal-backdrop" onClick={onClose}><div className="ticket-modal" onClick={event => event.stopPropagation()}><div className="modal-header"><div><div className="eyebrow"><span className="eyebrow-dot" />New support ticket</div><h2>Create a ticket</h2></div><button className="icon-button" onClick={onClose} aria-label="Close ticket dialog"><X size={19} /></button></div><div className="modal-form"><label className="field-label">Customer<input placeholder="Search customers" /></label><label className="field-label">Subject<input placeholder="What does the customer need help with?" /></label><div className="form-split"><label className="field-label">Priority<select defaultValue="Medium"><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></label><label className="field-label">Channel<select defaultValue="Website chat"><option>Website chat</option><option>WhatsApp</option><option>Slack</option><option>Messenger</option></select></label></div><label className="field-label">Description<textarea placeholder="Add context for the assigned agent..." rows="4" /></label></div><div className="modal-actions"><button className="ghost-button" onClick={onClose}>Cancel</button><button className="primary-button" onClick={onClose}>Create ticket <ArrowUpRight size={15} /></button></div></div></div> }

export default App

createRoot(document.getElementById('root')).render(<App />)
