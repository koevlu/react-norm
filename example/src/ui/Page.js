import React from 'react'
import { PreloadLink } from '../r-nrm'

const Page = ({ children }) =>
  <>
    <PreloadLink to='/'>index</PreloadLink>
    <div style={{ margin: '0 auto' }}>
      {children}
    </div>
    <br />
    <PreloadLink to='/'>index</PreloadLink>
  </>

export default Page
