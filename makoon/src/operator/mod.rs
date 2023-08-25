
pub mod model;
mod operator;
mod event;
mod repository;
mod repository_json;
mod generator;
mod error;
mod dispatcher;
mod ssh;
pub use operator::{Config, Operator};
pub use dispatcher::Dispatcher;
pub use repository::Repository;
pub use error::Error;

pub type Result<T> = std::result::Result<T, Error>;

pub use generator::DefaultClusterConfigurationGenerator;