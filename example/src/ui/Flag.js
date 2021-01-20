import React from 'react'
import fr from '../img/fr.svg'
import prus from '../img/prus.svg'
import rus from '../img/rus.png'

const FLAGS = {
  'Prussia': prus,
  'France': fr,
  'Russia': rus
}

const Flag = ({ country }) =>
  <img
    style={{ width: 20 }}
    src={FLAGS[country]}
    alt="flag"
  />

export default Flag
