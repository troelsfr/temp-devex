import React, { useCallback } from 'react'

import { QueryPreservingLink } from 'src'
import { hexAddrToZilAddr } from 'src/utils/Utils'
import { EventLogEntry, EventParam } from '@zilliqa-js/core/src/types'

interface IProps {
  events: EventLogEntry[]
}

const EventsTab: React.FC<IProps> = ({ events }) => {

  const highlightEventParams = useCallback((params: EventParam[]): React.ReactNode => {
    return params
      .map((param, index) => (
        <span key={index}>
          <span style={{ color: 'orangered' }}>{param.type}</span>
          {' '}
          {param.vname}
        </span>))
      .reduce((acc, ele): any => (acc === null ? [ele] : [acc, ', ', ele]))
  }, [])

  return (
    <>
      {events.map((event: EventLogEntry, index: number) => (
        <table key={index} className='receipt-table'>
          <tbody>
            <tr>
              <th>Function</th>
              <td>
                <span style={{ color: 'blueviolet' }}>
                  {event._eventname}
                </span>
                {' ('}{highlightEventParams(event.params)}{')'}
              </td>
            </tr>
            <tr>
              <th>Address</th>
              <td>{<QueryPreservingLink to={`/address/${hexAddrToZilAddr(event.address)}`}>{hexAddrToZilAddr(event.address)}</QueryPreservingLink>}</td>
            </tr>
            {event.params.length > 0 && (
              <>
                <tr style={{ height: '20px' }}><td><hr /></td></tr>
                <tr>
                  <td >Variable</td>
                  <td >Value</td>
                </tr>
                {event.params.map((param, index) => (
                  <tr key={index}>
                    <td>{param.vname}</td>
                    <td>
                      {typeof param.value === 'object'
                        ? <pre style={{ backgroundColor: 'rgba(0, 0, 0, 0.03)' }}>
                          {JSON.stringify(param.value, null, 2)}
                        </pre>
                        : Array.isArray(param.value)
                          ? param.value.toString()
                          : param.value}
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      )).reduce((acc: (React.ReactNode | null), x) => (
        acc === null
          ? x
          : <>{acc}<hr />{x}</>)
        , null)
      }
    </>
  )
}

export default EventsTab
