import React from "react";

import moment from 'moment';
import { Fn } from '../../../utils/fn/Fn.js';

import Person from './person.js';

export default class Schedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      schedule: [],
      startTime: null,
      endTime: null,
      peopleReady: false
    }
    console.log('Schedule props ',props)
    // this.addScheduleItem = this.addScheduleItem.bind(this)
    }
//   addScheduleItem() {
//     // let event = /
//     this.props.toggleInnerDrawer()

//     console.log('Event type',this.props.event.event.type)
//     let type = this.props.event.event.type;
    
//     let scheduleItem = {
//         day: this.props.event.day,
//         time: {
//             start: this.state.startTime,
//             end: this.state.endTime
//         } 
//     }


//     if(type === "event") {
//         let event = this.props.event.event;
//         if(!event.hasOwnProperty('schedule')) {
//             event.schedule = []
//         }
//         event.schedule.push(scheduleItem)


//     }

//     if(type === "project") {
//         let project = this.props.event.event.project;
//         if(!project.hasOwnProperty('schedule')) {
//             project.schedule = []
//         }
//         project.schedule.push(scheduleItem)


//     }
//   }
  async componentDidMount() {
    let schedule = this.props.event.event.schedule || [];
    this.setState({
      schedule: schedule
    });

    console.log('schedule',schedule)
    // let schedule_ = []
// for(let item of schedule){
//   if(item.people.length) {
//     let people = item.people;

//     await Fn.fetchScheduleUsers({ self: this, people }).then(
//       people => {
//         item.people_ = people 
//       }
//     )

//     schedule_.push(item)
//   }

// }

// this.setState({ schedule: schedule })

  }
  render() {
    return (
      <div className="flex flex-column flex-auto w-100 ph5 pb3">
        <div className="flex flex-row flex-auto justify-between w-100">
          <div className="flex ">
    <h3 className="f4 fw5 black-60">Schedule <span className="ph2 pv1 br1 bg-black-20 white f5 fw6  ml2 ">{this.state.schedule.length}</span></h3>
          </div>
          <div
            id="ScheduleButtons"
            className="flex flex-column"
          >
            <div id="" className="flex flex-row flex-auto">
              <button
              onClick={this.props.toggleInnerDrawer}
                id=""
                className="flex flex-row flex-auto w-100 ph3 pv2 br1 bg-black-20 black-50- white f5 fw6"
              >
                Add Schedule Item
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-column flex-auto w-100 pt4">
          {this.state.schedule.length && this.state.schedule.map((item, index) => (
            <div className="flex flex-column bg-white pt4 ph4  bs-b br3 mb3">
            <div className="flex flex-row items-center">
              <div className="flex ">
                <h3 className="f4 fw6 black ttc">{item.title}</h3>
              </div>
              <div className="flex ml3">
                <h3 className="f5 fw5 -60">
                  {moment(item.time.start).format('HH:mm')} - {moment(item.time.end).format('HH:mm')}
                </h3>
              </div>
              <div className="flex ml3">
                <h3 className="f5 fw5 -60">
                  {item.location}
                </h3>
              </div>
              
            </div>

<div className="flex">
<div 
                    style={{maxHeight: '300px'}}
                    className="overflow-auto flex flex-row items-start w-100 pv3">
                   {
                    item.people.map((item_,index_) => (
                      //  console.log('user',item),
                    <Person key={index_} item={item_} />
                     ))
                   }
                   </div>
</div>
</div>
          ))}
        </div>
      </div>
    );
  }
}
