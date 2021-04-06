import React, { Component } from "react";
import ReactDOM from "react-dom";
import SeatPicker from "react-seat-picker";
import axios from "axios";
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import 'react-dropdown/style.css';
import { Button } from "reactstrap";
const serverURL = "http://localhost:5000";
var len3=0;
export class MatchSeats extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          Rows:0,
          Cols:0,
          rowList:[],
          reserved:[],
      }
      this.fetchRowsCols = this.fetchRowsCols.bind(this);
      this.createRows = this.createRows.bind(this);
      this.fetchReserved = this.fetchReserved.bind(this);
      //this.fetchReserved();
      this.fetchRowsCols();
      this.createRows();

    
    }
    componentDidMount(){

      setInterval(() => {
          var len = this.state.reserved.length;
          this.fetchReserved();
          if(len!=len3){
              window.location.reload(false);
          }


      }, 1000);
  }

  /*componentWillMount() {
        this.fetchRowsCols();
        this.createRows(this.state.Rows, this.state.Cols);
       
  }*/
 
      fetchRowsCols(){
        
        this.fetchReserved();
        axios.get(serverURL + '/FetchStadium',{
            params: {
                StadiumName:this.props.StadiumName

            }
        }).then(
            result =>{ 
                this.setState({
                    Rows: result.data.NumberOfRows,
                    Cols: result.data.NumberOfColumns
                });
                //this.fetchReserved();
              this.createRows(result.data.NumberOfRows, result.data.NumberOfColumns);
              
             });
          
    }

      fetchReserved(){
        this.state.len=this.state.reserved.length;
        axios.get(serverURL + '/ReservedSeats',{
            params: {
                StadiumName:this.props.StadiumName,
                MatchDate:this.props.MatchDate
            }
        }).then(
            result =>{ 
                let arr=[];
                for(var i=0;i<result.data.length;i++){
                    arr.push(result.data[i].seatNo);

                }
                this.setState({
                    reserved:arr});
           
             });
          
    }
      createRows(row, seats){
        let rows=[]
        let tickt = 0;
        for(var i=0;i<row;++i){
            let newSeats=[]
            for(var j=0;j<seats;++j){
                if(this.state.reserved.includes(tickt)){
                     len3++;
                     newSeats.push({ id: i*seats+j, number: i*seats+j, isReserved:true});
                }
                else
                    newSeats.push({ id: i*seats+j, number: i*seats+j, isReserved:false});
                tickt++;
            }
            rows.push(newSeats);
        }
        this.setState({rowList:rows});
      }
   

    render() {

      return (
          <div>
              <Header/>
              {this.state.rowList.length>0?
                <SeatPicker
              rows={this.state.rowList}
            ></SeatPicker>:<div>
                {<script type="text/javascript">
                        {setInterval('window.location.reload()', 5000)}
                </script>} </div>
            
              }
              <Footer/>
          </div>
             
      );
    }
  }
  
  
  export default MatchSeats;