import React from 'react'
import { Link } from 'react-router'
import NavbarStore from '../store/NavbarStore'
import NavbarActions from '../actions/NavbarActions'


class Navbar extends React.Component {
	constructor(props) {
		super(props);
		this.state = NavbarStore.getState();
		this.onChange = this.onChange.bind(this)
	}

	componentDidMount(){ 
		NavbarStore.listen(this.onChange)
		NavbarActions.getCharacterCount()

		let socket = io.connect();

		socket.on('onlineUsers',(data) => {
			NavbarActions.updateOnlineUsers(data)
		})

		$(document).ajaxStart(() => {
			NavbarActions.updateAjaxAnimation('fadeIn')
		})
		
		$(document).ajaxComplete(() => {
			setTimeout(() => {
				NavbarActions.updateAjaxAnimation('fadeOut')
			}, 750);
		})
	}

	componentWillUnount() {
		NavbarStore.unlisten(this.onChange)
	}

	onChange(state){
		this.setState(state)
	}

	handleSubmit(event) {
		event.preventDefault()

		let searchQuery = this.state.searchQuery.trim()

		if(searchQuery){
			NavbarActions.findCharacter({
				searchQuery:searchQuery,
				searchForm:this.refs.searchForm,
				history:this.props.history
			})
		}
	}

	render() {
		return (
			<nav className='navbar navbar-default nabvar-static-top'>
				<div className="navbar-header">
					<button className="navbar-toggle collapsed" type="button" data-toggle='collapse' data-target='#navbar'>
						<span className="sr-only">
							Toggle navigation
						</span>
						<span className="icon-bar"></span>
						<span className="icon-bar"></span>
						<span className="icon-bar"></span>
					</button>
					<Link to='/' className='navbar-brand'>
						<span ref='triangles' className={'triangles animated' + this.state.ajaxAnimationClass}>
							<div className="tri invert"></div>
							<div className="tri invert"></div>
							<div className="tri"></div>
							<div className="tri invert"></div>
							<div className="tri invert"></div>
							<div className="tri"></div>
							<div className="tri invert"></div>
							<div className="tri"></div>
							<div className="tri invert"></div>
							
						</span>
						NEF
						<span className="badge badge-up badge-danger">{this.state.onlineUsers}</span>
					</Link>
				</div>
				<div id="navbar" className="navbar-collapse collapse">
					<form ref='searchForm' className="navbar-form navbar-left animated" onSubmit={this.handleSubmit.bind(this)}>
						<div className="input-group">
							<input type='text' className='form-control' placeholder={this.state.totalCharacters + 'characters '} value={this.state.searchQuery} onChange={NavbarActions.updateSearchQuery} />
							<span className="input-group-btn">
								<button className="btn btn-default" onclick={this.handleSubmit.bind(this)}>
									<span className="glyphicon glyphicon-search"></span>
								</button>
							</span>
						</div>
					</form>

					<ul className='nav navbar-nav'>
						<li><Link to='/'>HOME</Link></li>
						<li><Link to='/stats'>STATS</Link></li>
						<li className='dropdown'>
							<a href='#' className='dropdown-toggle' data-toggle='dropdown'>Female <span className='caret'></span></a>
			             	<ul className='dropdown-menu'>
			                <li><Link to='/female'>All</Link></li>
			                <li className='dropdown-submenu'>
			                  <Link to='/female/caldari'>Caldari</Link>
			                  <ul className='dropdown-menu'>
			                    <li><Link to='/female/caldari/achura'>Achura</Link></li>
			                    <li><Link to='/female/caldari/civire/'>Civire</Link></li>
			                    <li><Link to='/female/caldari/deteis'>Deteis</Link></li>
			                  </ul>
			                </li>
			                <li className='dropdown-submenu'>
			                  <Link to='/female/gallente'>Gallente</Link>
			                  <ul className='dropdown-menu'>
			                    <li><Link to='/female/gallente/gallente'>Gallente</Link></li>
			                    <li><Link to='/female/gallente/intaki'>Intaki</Link></li>
			                    <li><Link to='/female/gallente/jin-mei'>Jin-Mei</Link></li>
			                  </ul>
			                </li>
			                <li className='dropdown-submenu'>
			                  <Link to='/female/minmatar'>Minmatar</Link>
			                  <ul className='dropdown-menu'>
			                    <li><Link to='/female/minmatar/brutor'>Brutor</Link></li>
			                    <li><Link to='/female/minmatar/sebiestor'>Sebiestor</Link></li>
			                    <li><Link to='/female/minmatar/vherokior'>Vherokior</Link></li>
			                  </ul>
			                </li>
			                <li className='dropdown-submenu'>
			                  <Link to='/female/amarr'>Amarr</Link>
			                  <ul className='dropdown-menu'>
			                    <li><Link to='/female/amarr/amarr'>Amarr</Link></li>
			                    <li><Link to='/female/amarr/ni-kunni'>Ni-Kunni</Link></li>
			                    <li><Link to='/female/amarr/khanid'>Khanid</Link></li>
			                  </ul>
			                </li>
			              </ul>
			            </li>
			            <li className='dropdown'>
			              <a href='#' className='dropdown-toggle' data-toggle='dropdown'>Male <span className='caret'></span></a>
			              <ul className='dropdown-menu'>
			                <li><Link to='/male'>All</Link></li>
			                <li className='dropdown-submenu'>
			                  <Link to='/male/caldari'>Caldari</Link>
			                  <ul className='dropdown-menu'>
			                    <li><Link to='/male/caldari/achura'>Achura</Link></li>
			                    <li><Link to='/male/caldari/civire'>Civire</Link></li>
			                    <li><Link to='/male/caldari/deteis'>Deteis</Link></li>
			                  </ul>
			                </li>
			                <li className='dropdown-submenu'>
			                  <Link to='/male/gallente'>Gallente</Link>
			                  <ul className='dropdown-menu'>
			                    <li><Link to='/male/gallente/gallente'>Gallente</Link></li>
			                    <li><Link to='/male/gallente/intaki'>Intaki</Link></li>
			                    <li><Link to='/male/gallente/jin-mei'>Jin-Mei</Link></li>
			                  </ul>
			                </li>
			                <li className='dropdown-submenu'>
			                  <Link to='/male/minmatar'>Minmatar</Link>
			                  <ul className='dropdown-menu'>
			                    <li><Link to='/male/minmatar/brutor'>Brutor</Link></li>
			                    <li><Link to='/male/minmatar/sebiestor'>Sebiestor</Link></li>
			                    <li><Link to='/male/minmatar/vherokior'>Vherokior</Link></li>
			                  </ul>
			                </li>
			                <li className='dropdown-submenu'>
			                  <Link to='/male/amarr'>Amarr</Link>
			                  <ul className='dropdown-menu'>
			                    <li><Link to='/male/amarr/amarr'>Amarr</Link></li>
			                    <li><Link to='/male/amarr/ni-kunni'>Ni-Kunni</Link></li>
			                    <li><Link to='/male/amarr/khanid'>Khanid</Link></li>
			                  </ul>
			                </li>
			              </ul>
						</li>
						<li><Link to='/add'>Add</Link></li>
					</ul>

				</div>
			</nav>
		)
	}

}




