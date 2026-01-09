import React from 'react'

// Dashboard
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// Theme
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// Courses
const Getcourses = React.lazy(() => import('./views/Courses/getcourses/Getcourses'))
const Addcourses = React.lazy(() => import('./views/Courses/addcourses/Addcourses'))
const Getupcomingcourses = React.lazy(() => import('./views/Courses/getupcomingcourses/Getupcomingcourses'))
const Addupcomingcourses = React.lazy(() => import('./views/Courses/addupcomingcourses/Addupcomingcourses'))

// Blogs
const Getblogs = React.lazy(() => import('./views/Blogs/getblogs/Getblogs'))
const Addblogs = React.lazy(() => import('./views/Blogs/addblogs/Addblogs'))



// Charts
const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Views
const Addreview = React.lazy(() => import('./views/Reviews/addreview/Addreview'))
const Getreview = React.lazy(() => import('./views/Reviews/getreview/Getreview'))

// Widgets
const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

// ================= ROUTES =================
const routes = [
  { path: '/', name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },

  // Theme
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },

  // Courses
  { path: '/courses/getcourses', name: 'Get Courses', element: Getcourses },
  { path: '/courses/addcourses', name: 'Add Courses', element: Addcourses },
  { path: '/courses/getupcomingcourses', name: 'Get Upcoming Courses', element: Getupcomingcourses },
  { path: '/courses/addupcomingcourses', name: 'Add Upcoming Courses', element: Addupcomingcourses },

// Blogs 
  { path: '/Blogs/getblogs', name: 'Get blogs', element: Getblogs },
  { path: '/Blogs/addblogs', name: 'Add blogs', element: Addblogs },


  // Charts
  { path: '/charts', name: 'Charts', element: Charts },

  // Icons
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', element: Flags },
  { path: '/icons/brands', name: 'Brands', element: Brands },

  // Reviews
  { path: '/Reviews/addreview', name: 'Addviews', element: Addreview },
  { path: '/Reviews/getreview', name: 'getreview', element: Getreview },

  // Widgets
  { path: '/widgets', name: 'Widgets', element: Widgets },
]

export default routes
