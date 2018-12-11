Vagrant.configure("2") do |config|

    config.vm.box = "ubuntu/trusty64"
    config.vm.hostname = "sendgrid-lambda"
    config.ssh.forward_agent = true

    config.vm.provider :virtualbox do |vb|
        vb.memory = 512
    end

    #mount src folder to host
    config.vm.synced_folder "./src", "/opt/server/"

    config.vm.provision "shell", inline: <<-SHELL
        sudo apt-get update
        curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
        sudo apt-get install -y nodejs 
        sudo npm install -gy lambda-local
    SHELL
    # lambda-local -l index.js -e event.json -E '{\"DATABASE\":\"mongodb://localhost:27017/evie\"}'

end