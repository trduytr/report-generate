import React, { useState } from 'react'


import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField' 
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import moment from 'moment'

import CreatableSelect from 'react-select/creatable';

import ticketData from '../ticketData.json';

interface MileStoneProps {
    onClickDelete: Function,
    onChange: Function,
    index: Number,
    item: MileStoneItemProps
}

interface MileStoneItemProps {
    name: String,
    tantou: String,
    done: String,
    doing: String,
    nextweek: String
}

function MileStone(props: MileStoneProps) {

    return (
        <Grid item container rowSpacing={2} spacing={1} style={{alignItems: 'center'}}>
            <Grid item xs={3}>
            <CreatableSelect isClearable onChange={(value) => {
                    props.onChange({name: value?.label})
                }} options={ticketData.mileStone.map((item) => { return {label: item, value: item} })} />
                
            </Grid>
            <Grid item xs={2}>
            <CreatableSelect isClearable isMulti onChange={(value) => {
                    let valueString = value.map((item: any) => item.label.toString()).join(",")
                    props.onChange({tantou: valueString})
                }} options={ticketData.tantou.map((item) => { return {label: item, value: item} })} />
                
            </Grid>
            <Grid item xs={2}>
                <TextField fullWidth value={props.item.done} onChange={(event) => props.onChange({done: event.target.value})} id="outlined-basic" label="今週：完了" variant="outlined" size="small" />
            </Grid>
            <Grid item xs={2}>
                <TextField fullWidth value={props.item.doing} onChange={(event) => props.onChange({doing: event.target.value})}  id="outlined-basic" label="今週：対応中" variant="outlined" size="small" />
            </Grid>
            <Grid item xs={2}>
                <TextField fullWidth value={props.item.nextweek} onChange={(event) => props.onChange({nextweek: event.target.value})}  id="outlined-basic" label="来週：予定" variant="outlined" size="small" />
            </Grid>
            <Grid item xs={1}>
            <IconButton aria-label="delete" onClick={() => props.onClickDelete()}>
                <DeleteIcon />
            </IconButton>
            </Grid>
        </Grid>
    )
}


function Home() {
    const dateFormat = 'YYYY/MM/DD'
    const [date, setDate] = useState<String>(moment().format(dateFormat))
    const [milestone, setMileStone] = useState([{name: '', tantou: '', done: '', doing: '', nextweek: ''}])
    const [report, setReport] = useState<String | null>('')
    const [kadai, setKadai] = useState<String>('')
    const [renraku, setRenraku] = useState<String>('')
    const [gijiroku, setGijiroku] = useState<String>('')

    const datePlaceholder = '{date}'
    const milestonePlaceholder = '{milestone}'
    const kadaiPlaceholder = '{kadai}'
    const renrakuPlaceholder = '{renraku}'
    const gijirokuPlaceholder = '{gijiroku}'

    function removeMileStone (index: number) {
        const newMilestone = [...milestone]
        newMilestone.splice(index, 1)
        setMileStone(newMilestone)
    }

    function getReportTemp() {
        const reportTempFile = require("../reportTemp.txt");
        return fetch(reportTempFile)
            .then(response => response.text())
        
    }

    function fillDate(text: String) {
        if (date != null) {
            return text.replaceAll(datePlaceholder, date.toString())
        } else {
            return text.replaceAll(datePlaceholder, '')
        }
    }

    function fillMileStone(text: String) {
        if (milestone.length <= 0 ) {
            return text.replaceAll(milestonePlaceholder, '')
        }
        let mileStoneString = ''
        milestone.forEach(item => {
            mileStoneString += item.name.length > 0 ? '||[milestone:'+ item.name +'] ' : '|| なし'
            mileStoneString += item.tantou.length > 0 ? ' || '+ item.tantou.replaceAll(',', ',[[BR]]') : ' || なし'
            let doneAry: String[] = []
            if (item.done.length > 0) {
                doneAry = item.done.split(",").map(item => {
                    if (item.charAt(0) !== '#' && !isNaN(parseFloat(item))) {
                        return "#" + item
                    }
                    return item
                })
            }
            mileStoneString += doneAry.length > 0 ? ' || '+ doneAry.join(',[[BR]]') : ' || なし'
            let doingAry: String[] = []
            if (item.doing.length > 0) {
                doingAry = item.doing.split(",").map(item => {
                    if (item.charAt(0) !== '#' && !isNaN(parseFloat(item))) {
                        return "#" + item
                    }
                    return item
                })
            }
            mileStoneString += doingAry.length > 0 ? ' || '+ doingAry.join(',[[BR]]') : ' || なし'

            let nextweekAry: String[] = []
            if (item.nextweek.length > 0) {
                nextweekAry = item.nextweek.split(",").map(item => {
                    if (item.charAt(0) !== '#' && !isNaN(parseFloat(item))) {
                        return "#" + item
                    }
                    return item
                })
            }

            mileStoneString += nextweekAry.length > 0 ? ' || '+ nextweekAry.join(',[[BR]]') : ' || なし'
            mileStoneString += ' ||\n'

        
        })
        return text.replaceAll(milestonePlaceholder, mileStoneString)

    }

    function fillKadai(text: String) {
        if (kadai.length <=0) {
            return text.replaceAll(kadaiPlaceholder, '* なし')
        }
        return text.replaceAll(kadaiPlaceholder, kadai.toString())
    }

    function fillRenraku(text: String) {
        if (renraku.length <=0) {
            return text.replaceAll(renrakuPlaceholder, '* なし')
        }
        return text.replaceAll(renrakuPlaceholder, renraku.toString())
    }

    function fillGijiroku(text: String) {
        if (gijiroku.length <=0) {
            return text.replaceAll(gijirokuPlaceholder, '* 作成中')
        }
        return text.replaceAll(gijirokuPlaceholder, gijiroku.toString())
    }

    function generateReport() {
        
        getReportTemp()
            .then(text => fillDate(text))
            .then(text => fillMileStone(text))
            .then(text => fillKadai(text))
            .then(text => fillRenraku(text))
            .then(text => fillGijiroku(text))
            .then(text => setReport(text) )
    }
    return (
        <>
            <Box
                component="form"
                noValidate
                autoComplete="off"
                >
                <Grid container rowSpacing={2}>
                    <DatePicker
                        format={dateFormat}
                        label="Report Date"
                        value={moment(date.toString())}
                        onChange={(newValue) => setDate(moment(newValue).format(dateFormat))}
                        />
                
                
                    {milestone.length > 0 && 
                        milestone.map((item, index) => {
                            return (<MileStone 
                                item={item}
                                key={index} 
                                onClickDelete={() => removeMileStone(index)} 
                                index={index} 
                                onChange={(valueObj: any) => {
                                    const currentItem = {...item}
                                    const newItem = {...currentItem, ...valueObj}
                                    const newMilestone = [...milestone]
                                    newMilestone[index] = newItem
                                    setMileStone(newMilestone)
                                }}
                                />)
                        })
                    }       
                
                    <Grid item xs={12}>
                        <Button variant="contained" onClick={() => {setMileStone([...milestone, {name: '', tantou: '', done: '', doing: '', nextweek: ''}])}}>Add Milestone</Button>
                    </Grid>
                    
                    <Grid item xs={12}>
                        <TextField
                            label="課題"
                            value={kadai}
                            onChange={(event) => setKadai(event.target.value)}
                            fullWidth
                            multiline
                            rows={10}
                            />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="連絡項目"
                            value={renraku}
                            onChange={(event) => setRenraku(event.target.value)}
                            fullWidth
                            multiline
                            rows={10}
                            />
                        
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="議事録"
                            value={gijiroku}
                            onChange={(event) => setGijiroku(event.target.value)}
                            fullWidth
                            multiline
                            rows={10}
                            />
                    </Grid>
                    
                    <Grid item xs={12}>
                        <Button variant="contained" onClick={() => generateReport()}>Generate Report</Button>
                    </Grid>
                    
                    <Grid item xs={12}>
                        <TextField
                            value={report}
                            onChange={(event) => setReport(event.target.value)}
                            fullWidth
                            multiline
                            rows={10}
                            />
                    </Grid>
                    
                </Grid>
            </Box>

        </>
        
    )
}

export default Home