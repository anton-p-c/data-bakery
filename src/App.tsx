import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Drawer from '@mui/material/Drawer'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Provider } from 'jotai'
import { ConnectionForm } from './components/ConnectionForm'
import { CreateOrUpdateNodeForm } from './components/CreateOrUpdateNodeForm'
import { store } from './store'

const LEFT_SIDEBAR_WIDTH = 280
const RIGHT_SIDEBAR_WIDTH = 420

const drawerPaperSx = (width: number) => ({
  width,
  boxSizing: 'border-box' as const,
  height: '100%',
  overflow: 'auto',
})

function App() {
  return (
    <>
      <CssBaseline />
      <Provider store={store}>
        <Stack
          direction="row"
          sx={{
            width: '100%',
            height: '100vh',
            overflow: 'hidden',
          }}
        >
          <Drawer
            variant="permanent"
            anchor="left"
            sx={{
              width: LEFT_SIDEBAR_WIDTH,
              flexShrink: 0,
              '& .MuiDrawer-paper': drawerPaperSx(LEFT_SIDEBAR_WIDTH),
            }}
          >
            <Box component="nav" aria-label="Left sidebar" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Left sidebar
              </Typography>
            </Box>
          </Drawer>

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              minWidth: 0,
              height: '100%',
              overflow: 'auto',
              p: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              <CreateOrUpdateNodeForm />
            </Typography>
          </Box>

          <Drawer
            variant="permanent"
            anchor="right"
            sx={{
              width: RIGHT_SIDEBAR_WIDTH,
              flexShrink: 0,
              '& .MuiDrawer-paper': drawerPaperSx(RIGHT_SIDEBAR_WIDTH),
            }}
          >
            <Box component="aside" aria-label="Right sidebar" sx={{ p: 2 }}>
              <ConnectionForm />
            </Box>
          </Drawer>
        </Stack>
      </Provider>
    </>
  )
}

export default App
