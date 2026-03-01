import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/workouts', label: 'Workouts', icon: '💪' },
  { to: '/milestones', label: 'Goals', icon: '🎯' },
  { to: '/rewards', label: 'Rewards', icon: '🏆' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
]

export function BottomNav() {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: 'calc(var(--nav-height) + var(--safe-bottom))',
      paddingBottom: 'var(--safe-bottom)',
      background: 'var(--color-surface)',
      borderTop: '1px solid var(--color-border)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 100,
    }}>
      {navItems.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            textDecoration: 'none',
            fontSize: '0.7rem',
            color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            fontWeight: isActive ? 600 : 400,
          })}
        >
          <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
