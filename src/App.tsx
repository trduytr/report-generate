import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'

import Sidebar from './components/Sidebar'

import Home from './pages/Home';

import styled from 'styled-components'

const Container = styled.div `
  padding: 50px;
`

const App: React.FunctionComponent = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
        <Router>
        <Sidebar />
        <Container>
          <Routes>
            <Route path='/report-generate' element={<Home />} />
          </Routes>
        </Container>
        
      </Router> 
    </LocalizationProvider>
  )
}

export default App