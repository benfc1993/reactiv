import { BasicComponent, Text } from './Components/Component'
import { TestContext, useStore } from './Components/store'
import { Component } from './Reactiv/types'

export const App: Component = (): Node => {
	return (
		<div className='App'>
			<TestContext.Provider value={useStore(27)}>
				<div className='new-element'>
					<Text count={2} />
				</div>
				<div>
					<div>
						<div>
							<BasicComponent count={4}>
								<p>Testing</p>
							</BasicComponent>
						</div>
					</div>
				</div>
			</TestContext.Provider>
			<TestContext.Provider value={useStore(27)}>
				<div className='sibling-here'>
					<>
						<Text count={3} />
					</>
				</div>
			</TestContext.Provider>
		</div>
	)
}
